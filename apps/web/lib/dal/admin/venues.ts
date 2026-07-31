import {
  getDevBypassVenue,
  isDevBypassSessionActive,
} from '@/lib/admin/dev-bypass'
import { apiFetchAuth } from '@/lib/api/server-client'
import type { VenueRow } from '@/lib/dal/admin/types'

interface VenueApiDto {
  id: string
  ownerId: string
  name: string
  address: string | null
  pricePerHourCents: number
  availability: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

function toVenueRow(dto: VenueApiDto): VenueRow {
  return {
    id: dto.id,
    owner_id: dto.ownerId,
    name: dto.name,
    address: dto.address,
    price_per_hour_cents: dto.pricePerHourCents,
    availability: dto.availability,
    created_at: dto.createdAt,
    updated_at: dto.updatedAt,
  }
}

export async function listMyVenues(_ownerId: string): Promise<VenueRow[]> {
  if (await isDevBypassSessionActive()) {
    return [getDevBypassVenue()]
  }

  const rows = await apiFetchAuth<VenueApiDto[]>('venues/mine')
  return rows.map(toVenueRow)
}

export async function getMyPrimaryVenue(
  ownerId: string,
): Promise<VenueRow | null> {
  const venues = await listMyVenues(ownerId)
  return venues[0] ?? null
}

export async function upsertMyVenue(
  _ownerId: string,
  payload: {
    id?: string
    name: string
    address?: string | null
    price_per_hour_cents?: number
  },
): Promise<VenueRow> {
  if (await isDevBypassSessionActive()) {
    const base = getDevBypassVenue()
    return {
      ...base,
      id: payload.id ?? base.id,
      name: payload.name,
      address: payload.address ?? base.address,
      price_per_hour_cents:
        payload.price_per_hour_cents ?? base.price_per_hour_cents,
      updated_at: new Date().toISOString(),
    }
  }

  const row = await apiFetchAuth<VenueApiDto>('venues/mine', {
    method: 'PUT',
    body: JSON.stringify({
      id: payload.id,
      name: payload.name,
      address: payload.address,
      pricePerHourCents: payload.price_per_hour_cents,
    }),
  })
  return toVenueRow(row)
}
