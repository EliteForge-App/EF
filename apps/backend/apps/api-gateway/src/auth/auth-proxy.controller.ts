import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@ef/contracts';
import { AuthProxyService } from './auth-proxy.service';
import { CurrentUser } from './decorators';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authProxy: AuthProxyService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authProxy.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authProxy.register(dto);
  }

  @Post('validate')
  validate(@Body('token') token: string) {
    return this.authProxy.validateToken(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { sub: string }) {
    return this.authProxy.getMe(user.sub);
  }
}
