import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AuthResponse,
  AuthTokenPayload,
  LoginDto,
  RegisterDto,
  ValidateTokenResponse,
} from '@ef/contracts';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    try {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new UnauthorizedException('Email already registered');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.userRepository.create({
        email: dto.email,
        passwordHash,
        name: dto.name,
      });

      return await this.buildAuthResponse(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `register failed for ${dto.email}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const valid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return await this.buildAuthResponse(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `login failed for ${dto.email}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<AuthTokenPayload>(token);
      return { valid: true, userId: payload.sub, email: payload.email };
    } catch {
      return { valid: false };
    }
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    name: string;
  }): Promise<AuthResponse> {
    try {
      const payload: AuthTokenPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch (error) {
      this.logger.error(
        `JWT sign failed for user ${user.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
