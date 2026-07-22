import { cookies } from 'next/headers'
import {
  AUTH_COOKIE_NAME,
  DEV_ADMIN_BYPASS_TOKEN,
} from '@/lib/auth/constants'
import { getAdminHomePath, type AdminRole } from '@/lib/admin/roles'
import type { ReservationRow, VenueRow } from '@/lib/dal/admin/types'

export function isDevEnvironment() {
  return process.env.NODE_ENV === 'development'
}

export function isDevAdminBypassToken(token: string | undefined | null) {
  return isDevEnvironment() && token === DEV_ADMIN_BYPASS_TOKEN
}

export async function isDevAdminBypassActive() {
  if (!isDevEnvironment()) return false
  const cookieStore = await cookies()
  return isDevAdminBypassToken(cookieStore.get(AUTH_COOKIE_NAME)?.value)
}

const DEV_ROLE: AdminRole = 'Empresario'

export function getDevAdminSession() {
  return {
    user: { id: 'dev-admin', email: 'dev@eliteforge.local' },
    role: DEV_ROLE,
    name: 'Dev Admin',
    homePath: getAdminHomePath(DEV_ROLE),
  }
}

export function getDevDemoVenues(): VenueRow[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'dev-venue-1',
      owner_id: 'dev-admin',
      name: 'Cancha Demo Norte',
      address: 'Calle Demo 123',
      price_per_hour_cents: 4500000,
      availability: {},
      created_at: now,
      updated_at: now,
    },
  ]
}

export function getDevDemoReservations(): ReservationRow[] {
  const startsAt = new Date()
  startsAt.setDate(startsAt.getDate() + 1)
  startsAt.setHours(18, 0, 0, 0)
  const endsAt = new Date(startsAt)
  endsAt.setHours(19, 0, 0, 0)

  return [
    {
      id: 'dev-reservation-1',
      user_id: 'dev-player',
      venue_id: 'dev-venue-1',
      venue_name: 'Cancha Demo Norte',
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: 'pending',
      notes: 'Reserva de ejemplo (modo dev)',
      created_at: new Date().toISOString(),
    },
  ]
}
