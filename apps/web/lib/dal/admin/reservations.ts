import { apiFetchAuth } from '@/lib/api/server-client'
import {
  getDevDemoReservations,
  isDevAdminBypassActive,
} from '@/lib/admin/dev-bypass'
import type { ReservationRow, ReservationStatus } from '@/lib/dal/admin/types'

interface ReservationApiDto {
  id: string
  userId: string
  venueId: string | null
  venueName: string
  startsAt: string
  endsAt: string
  status: ReservationStatus
  notes: string | null
  createdAt: string
}

function toReservationRow(dto: ReservationApiDto): ReservationRow {
  return {
    id: dto.id,
    user_id: dto.userId,
    venue_id: dto.venueId,
    venue_name: dto.venueName,
    starts_at: dto.startsAt,
    ends_at: dto.endsAt,
    status: dto.status,
    notes: dto.notes,
    created_at: dto.createdAt,
  }
}

export async function listReservationsForVenueOwner(
  _ownerId: string,
): Promise<ReservationRow[]> {
  if (await isDevAdminBypassActive()) {
    return getDevDemoReservations()
  }

  const rows = await apiFetchAuth<ReservationApiDto[]>('reservations/mine')
  return rows.map(toReservationRow)
}

export async function updateReservationStatusAsOwner(
  _ownerId: string,
  reservationId: string,
  status: ReservationStatus,
): Promise<void> {
  if (await isDevAdminBypassActive()) {
    return
  }

  await apiFetchAuth(`reservations/${reservationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function formatReservationSchedule(startsAt: string, endsAt: string) {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const date = start.toLocaleDateString('es', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const startTime = start.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const endTime = end.toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date} · ${startTime} – ${endTime}`
}

const statusLabels: Record<ReservationStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

export function getReservationStatusLabel(status: ReservationStatus) {
  return statusLabels[status]
}
