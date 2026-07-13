import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ReservationDto,
  UpdateReservationStatusPayload,
  UpsertVenuePayload,
  VenueDto,
} from '@ef/contracts';
import { VenueRepository } from './repositories/venue.repository';

@Injectable()
export class VenuesService {
  constructor(private readonly venueRepository: VenueRepository) {}

  listMine(ownerId: string): Promise<VenueDto[]> {
    return this.venueRepository.listByOwner(ownerId);
  }

  upsertMine(payload: UpsertVenuePayload): Promise<VenueDto> {
    const { ownerId, ...dto } = payload;
    return this.venueRepository.upsertForOwner(ownerId, dto);
  }

  listReservationsMine(ownerId: string): Promise<ReservationDto[]> {
    return this.venueRepository.listReservationsForOwner(ownerId);
  }

  async updateReservationStatus(
    payload: UpdateReservationStatusPayload,
  ): Promise<void> {
    try {
      await this.venueRepository.updateReservationStatus(
        payload.ownerId,
        payload.reservationId,
        payload.status,
      );
    } catch {
      throw new NotFoundException('Reservation not found');
    }
  }
}
