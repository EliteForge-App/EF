import { NextResponse } from 'next/server'

import {
  DEV_BYPASS_COOKIE_VALUE,
  getDevBypassSession,
  isAdminDevBypassEnabled,
} from '@/lib/admin/dev-bypass'
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants'

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

/** Indica si el bypass UI está disponible (solo no-producción + env). */
export async function GET() {
  return NextResponse.json({ enabled: isAdminDevBypassEnabled() })
}

/** Entra al portal con sesión mock sin llamar al gateway. */
export async function POST() {
  if (!isAdminDevBypassEnabled()) {
    return NextResponse.json(
      { error: 'Dev bypass deshabilitado' },
      { status: 403 },
    )
  }

  const session = getDevBypassSession()
  const response = NextResponse.json({
    ok: true,
    homePath: session.homePath,
    role: session.role,
  })

  response.cookies.set(AUTH_COOKIE_NAME, DEV_BYPASS_COOKIE_VALUE, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK_SECONDS,
  })

  return response
}
