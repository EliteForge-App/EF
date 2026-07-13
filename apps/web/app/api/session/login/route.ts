import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants'

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

export async function POST(request: Request) {
  const body = (await request.json()) as { accessToken?: string }

  if (!body.accessToken) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_COOKIE_NAME, body.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK_SECONDS,
  })

  return response
}
