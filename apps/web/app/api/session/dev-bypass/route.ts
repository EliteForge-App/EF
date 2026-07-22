import { NextResponse } from 'next/server'
import {
  AUTH_COOKIE_NAME,
  DEV_ADMIN_BYPASS_TOKEN,
} from '@/lib/auth/constants'
import { isDevEnvironment } from '@/lib/admin/dev-bypass'

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

export async function POST() {
  if (!isDevEnvironment()) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_COOKIE_NAME, DEV_ADMIN_BYPASS_TOKEN, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK_SECONDS,
  })

  return response
}
