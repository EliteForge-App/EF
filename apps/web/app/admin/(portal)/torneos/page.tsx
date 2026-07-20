import { requireAdminSession } from '@/lib/admin/session'
import { TournamentsDashboard } from '@/components/admin/tournaments-dashboard'
import { redirect } from 'next/navigation'

export default async function AdminTorneosPage() {
  const session = await requireAdminSession()

  if (session.role === 'Administrador') {
    redirect('/admin/metricas')
  }

  return <TournamentsDashboard />
}
