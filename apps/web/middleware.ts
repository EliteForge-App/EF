import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  AUTH_COOKIE_NAME,
  DEV_ADMIN_BYPASS_TOKEN,
} from '@/lib/auth/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login')
  ) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // El bypass de desarrollo no es válido en producción.
    if (
      token === DEV_ADMIN_BYPASS_TOKEN &&
      process.env.NODE_ENV !== 'development'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const response = NextResponse.redirect(url)
      response.cookies.delete(AUTH_COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
