import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export type ReservationStatusDto = 'pending' | 'confirmed' | 'cancelled';

export interface VenueDto {
  id: string;
  ownerId: string;
  name: string;
  address: string | null;
  pricePerHourCents: number;
  availability: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class UpsertVenueDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerHourCents?: number;
}

export interface ReservationDto {
  id: string;
  userId: string;
  venueId: string | null;
  venueName: string;
  startsAt: string;
  endsAt: string;
  status: ReservationStatusDto;
  notes: string | null;
  createdAt: string;
}

export class UpdateReservationStatusDto {
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status!: ReservationStatusDto;
}

export class UpdateReservationStatusPayload extends UpdateReservationStatusDto {
  @IsUUID()
  reservationId!: string;

  @IsUUID()
  ownerId!: string;
}

export class UpsertVenuePayload extends UpsertVenueDto {
  @IsUUID()
  ownerId!: string;
}

export class OwnerPayload {
  @IsUUID()
  ownerId!: string;
}
