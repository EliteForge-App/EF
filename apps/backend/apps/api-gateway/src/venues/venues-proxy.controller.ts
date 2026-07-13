import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SYSTEM_ROLE_NAMES } from '@ef/common';
import { UpdateReservationStatusDto, UpsertVenueDto } from '@ef/contracts';
import { CurrentUser, Roles } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { VenuesProxyService } from './venues-proxy.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(SYSTEM_ROLE_NAMES.EMPRESARIO, SYSTEM_ROLE_NAMES.ADMINISTRADOR)
export class VenuesProxyController {
  constructor(private readonly venuesProxy: VenuesProxyService) {}

  @Get('venues/mine')
  listMine(@CurrentUser() user: { sub: string }) {
    return this.venuesProxy.listMine(user.sub);
  }

  @Put('venues/mine')
  upsertMine(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpsertVenueDto,
  ) {
    return this.venuesProxy.upsertMine(user.sub, dto);
  }

  @Get('reservations/mine')
  listReservationsMine(@CurrentUser() user: { sub: string }) {
    return this.venuesProxy.listReservationsMine(user.sub);
  }

  @Patch('reservations/:id/status')
  updateReservationStatus(
    @CurrentUser() user: { sub: string },
    @Param('id') reservationId: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.venuesProxy.updateReservationStatus(
      user.sub,
      reservationId,
      dto,
    );
  }
}
