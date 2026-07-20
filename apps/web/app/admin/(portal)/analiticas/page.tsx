import { requireAdminSession } from '@/lib/admin/session'
import { listReservationsForVenueOwner } from '@/lib/dal/admin/reservations'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import { redirect } from 'next/navigation'

export default async function AdminAnaliticasPage() {
  const session = await requireAdminSession()

  if (session.role === 'Administrador') {
    redirect('/admin/metricas')
  }

  let reservations: Awaited<ReturnType<typeof listReservationsForVenueOwner>> =
    []

  try {
    reservations = await listReservationsForVenueOwner(session.user.id)
  } catch {
    reservations = []
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <AnalyticsDashboard reservations={reservations} />
    </div>
  )
}
