import { redirect } from 'next/navigation'
import { apiFetchAuth } from '@/lib/api/server-client'
import { getAdminHomePath, isAdminRole } from '@/lib/admin/roles'
import {
  getDevBypassSession,
  isDevBypassSessionActive,
} from '@/lib/admin/dev-bypass'

export interface AuthMeUser {
  id: string
  email: string
  name: string
  role: string
}

export async function getAdminSession() {
  if (await isDevBypassSessionActive()) {
    return getDevBypassSession()
  }

  try {
    const me = await apiFetchAuth<AuthMeUser>('auth/me')

    if (!isAdminRole(me.role)) {
      return null
    }

    return {
      user: { id: me.id, email: me.email },
      role: me.role,
      name: me.name,
      homePath: getAdminHomePath(me.role),
    }
  } catch {
    return null
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}
