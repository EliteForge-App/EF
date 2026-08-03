import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoginDto, RegisterDto, ValidateTokenDto } from '@ef/contracts';
import { AuthProxyService } from './auth-proxy.service';
import { CurrentUser } from './decorators';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authProxy: AuthProxyService) {}

  /** Login: límite estricto anti brute-force. */
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authProxy.login(dto);
  }

  /** Registro: evita spam de cuentas. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authProxy.register(dto);
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validate(@Body() dto: ValidateTokenDto) {
    return this.authProxy.validateToken(dto.token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { sub: string }) {
    return this.authProxy.getMe(user.sub);
  }
}
