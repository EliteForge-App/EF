import { cookies } from 'next/headers'
import { apiFetch } from '@/lib/api/client'
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants'

function getServerApiBase(): string {
  const gateway = process.env.API_GATEWAY_URL?.replace(/\/$/, '')
  if (gateway) {
    return `${gateway}/api`
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (site) {
    return `${site}/api`
  }

  return 'http://localhost:3000/api'
}

export async function apiFetchAuth<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const url = `${getServerApiBase()}/${path.replace(/^\//, '')}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data && typeof data.message === 'string' && data.message) ||
      (Array.isArray(data?.message) && data.message.join(', ')) ||
      'Error de conexión con el servidor'
    throw new Error(message)
  }

  return data as T
}
