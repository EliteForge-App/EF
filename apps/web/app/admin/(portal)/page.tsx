import Link from 'next/link'
import { requireAdminSession } from '@/lib/admin/session'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { listMyVenues } from '@/lib/dal/admin/venues'
import { listReservationsForVenueOwner } from '@/lib/dal/admin/reservations'

export default async function AdminHomePage() {
  const session = await requireAdminSession()
  const isBusiness = session.role === 'Administrador'

  if (isBusiness) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <AdminPageHeader
          title={`Hola, ${session.name.split(' ')[0]}`}
          subtitle="Panel de métricas y rendimiento de jugadores."
        />
        <Button render={<Link href="/admin/metricas" />}>
          Ver métricas
        </Button>
      </div>
    )
  }

  const venues = await listMyVenues(session.user.id)
  let reservationsCount = 0
  try {
    const reservations = await listReservationsForVenueOwner(session.user.id)
    reservationsCount = reservations.filter((r) => r.status === 'pending').length
  } catch {
    reservationsCount = 0
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <AdminPageHeader
        title={`Hola, ${session.name.split(' ')[0]}`}
        subtitle="Gestiona reservas, disponibilidad y operación de tu cancha."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Canchas
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">
            {venues.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Reservas pendientes
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">
            {reservationsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Rol
          </p>
          <p className="mt-2 font-heading text-lg font-semibold text-foreground">
            {session.role}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link href="/admin/reservas" />}>Ver reservas</Button>
        <Button
          render={<Link href="/admin/mi-cancha" />}
          variant="outline"
        >
          Configurar cancha
        </Button>
      </div>
    </div>
  )
}
