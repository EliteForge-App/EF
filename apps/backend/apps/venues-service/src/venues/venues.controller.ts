import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@ef/common';
import {
  OwnerPayload,
  UpdateReservationStatusPayload,
  UpsertVenuePayload,
} from '@ef/contracts';
import { VenuesService } from './venues.service';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @MessagePattern(MESSAGE_PATTERNS.VENUES.LIST_MINE)
  listMine(@Payload() data: OwnerPayload) {
    return this.venuesService.listMine(data.ownerId);
  }

  @MessagePattern(MESSAGE_PATTERNS.VENUES.UPSERT_MINE)
  upsertMine(@Payload() data: UpsertVenuePayload) {
    return this.venuesService.upsertMine(data);
  }

  @MessagePattern(MESSAGE_PATTERNS.VENUES.LIST_RESERVATIONS_MINE)
  listReservationsMine(@Payload() data: OwnerPayload) {
    return this.venuesService.listReservationsMine(data.ownerId);
  }

  @MessagePattern(MESSAGE_PATTERNS.VENUES.UPDATE_RESERVATION_STATUS)
  updateReservationStatus(@Payload() data: UpdateReservationStatusPayload) {
    return this.venuesService.updateReservationStatus(data);
  }
}
