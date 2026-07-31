import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SYSTEM_ROLE_NAMES } from '@ef/common';
import {
  AuthTokenPayload,
  UpdatePreferencesDto,
  UpdateProfileDto,
} from '@ef/contracts';
import { CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersProxyService } from './users-proxy.service';

/**
 * Perfil y preferencias: JWT obligatorio.
 * - Propietario del recurso (sub === :id) → permitido.
 * - Rol Administrador → permitido sobre cualquier usuario.
 * - Jugador / Empresario / Viewer sobre recurso ajeno → 403.
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersProxyController {
  constructor(private readonly usersProxy: UsersProxyService) {}

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    this.assertCanAccessUser(user, id);
    return this.usersProxy.findById(id);
  }

  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    this.assertCanAccessUser(user, id);
    return this.usersProxy.updateProfile(id, dto);
  }

  @Get(':id/preferences')
  getPreferences(
    @Param('id') id: string,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    this.assertCanAccessUser(user, id);
    return this.usersProxy.getPreferences(id);
  }

  @Patch(':id/preferences')
  updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdatePreferencesDto,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    this.assertCanAccessUser(user, id);
    return this.usersProxy.updatePreferences(id, dto);
  }

  private assertCanAccessUser(
    user: AuthTokenPayload,
    resourceUserId: string,
  ): void {
    if (user.sub === resourceUserId) {
      return;
    }

    if (user.role === SYSTEM_ROLE_NAMES.ADMINISTRADOR) {
      return;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}
