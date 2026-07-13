export const ADMIN_ROLES = ['Empresario', 'Administrador'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export function isAdminRole(
  role: string | null | undefined,
): role is AdminRole {
  if (!role) return false
  return (ADMIN_ROLES as readonly string[]).includes(role)
}

export function getAdminHomePath(role: string | null | undefined) {
  if (role === 'Administrador') return '/admin/metricas'
  if (role === 'Empresario') return '/admin/reservas'
  return '/admin'
}
