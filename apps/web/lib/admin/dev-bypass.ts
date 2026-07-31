import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from '@/lib/auth/constants'
import { getAdminHomePath, type AdminRole } from '@/lib/admin/roles'
import type { VenueRow } from '@/lib/dal/admin/types'

/** Valor opaco de `ef_token` cuando el portal corre en modo UI sin backend. */
export const DEV_BYPASS_COOKIE_VALUE = 'ef-dev-ui-bypass'

const DEV_BYPASS_ROLE: AdminRole = 'Empresario'

/**
 * Bypass solo en desarrollo local.
 * Activar con `EF_ADMIN_DEV_BYPASS=true` en `apps/web/.env.local`.
 * Nunca se habilita si `NODE_ENV === 'production'`.
 */
export function isAdminDevBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.EF_ADMIN_DEV_BYPASS === 'true'
  )
}

export function getDevBypassSession() {
  return {
    user: {
      id: 'dev-bypass-user',
      email: 'dev.ui@eliteforge.local',
    },
    role: DEV_BYPASS_ROLE,
    name: 'Dev UI Empresario',
    homePath: getAdminHomePath(DEV_BYPASS_ROLE),
  }
}

export async function isDevBypassSessionActive(): Promise<boolean> {
  if (!isAdminDevBypassEnabled()) return false
  const jar = await cookies()
  return jar.get(AUTH_COOKIE_NAME)?.value === DEV_BYPASS_COOKIE_VALUE
}

/** Cancha de demostración para UI sin API. */
export function getDevBypassVenue(): VenueRow {
  const now = new Date().toISOString()
  return {
    id: 'dev-bypass-venue',
    owner_id: 'dev-bypass-user',
    name: 'Cancha Demo UI',
    address: 'Calle Frontend 1 · Solo desarrollo',
    price_per_hour_cents: 25000,
    availability: {},
    created_at: now,
    updated_at: now,
  }
}
