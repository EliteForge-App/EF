import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { MESSAGE_PATTERNS, SERVICE_NAMES, toHttpException } from '@ef/common';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  ValidateTokenResponse,
} from '@ef/contracts';

@Injectable()
export class AuthProxyService {
  constructor(
    @Inject(SERVICE_NAMES.AUTH) private readonly authClient: ClientProxy,
  ) {}

  login(dto: LoginDto): Promise<AuthResponse> {
    return this.send<AuthResponse>(MESSAGE_PATTERNS.AUTH.LOGIN, dto);
  }

  register(dto: RegisterDto): Promise<AuthResponse> {
    return this.send<AuthResponse>(MESSAGE_PATTERNS.AUTH.REGISTER, dto);
  }

  validateToken(token: string): Promise<ValidateTokenResponse> {
    return this.send<ValidateTokenResponse>(
      MESSAGE_PATTERNS.AUTH.VALIDATE_TOKEN,
      { token },
    );
  }

  private send<T>(pattern: string, payload: unknown): Promise<T> {
    return firstValueFrom(
      this.authClient.send<T>(pattern, payload).pipe(
        catchError((error: unknown) =>
          throwError(() => toHttpException(error)),
        ),
      ),
    );
  }
}
