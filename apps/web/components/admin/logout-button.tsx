'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/session/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  )
}
