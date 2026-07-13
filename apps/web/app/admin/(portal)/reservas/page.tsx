import { requireAdminSession } from '@/lib/admin/session'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import {
  formatReservationSchedule,
  getReservationStatusLabel,
  listReservationsForVenueOwner,
} from '@/lib/dal/admin/reservations'
import {
  cancelReservation,
  confirmReservation,
} from '@/app/admin/(portal)/reservas/actions'
import { redirect } from 'next/navigation'

export default async function AdminReservasPage() {
  const session = await requireAdminSession()

  if (session.role === 'Administrador') {
    redirect('/admin/metricas')
  }

  let reservations: Awaited<ReturnType<typeof listReservationsForVenueOwner>> =
    []
  let loadError: string | null = null

  try {
    reservations = await listReservationsForVenueOwner(session.user.id)
  } catch {
    loadError =
      'No se pudieron cargar las reservas. Verifica que el backend esté activo.'
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <AdminPageHeader
        title="Reservas"
        subtitle="Confirma o cancela solicitudes de tus canchas."
      />

      {loadError && (
        <p className="mb-4 text-sm text-destructive">{loadError}</p>
      )}

      <div className="space-y-3">
        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No hay reservas vinculadas a tus canchas todavía.
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-heading font-semibold text-card-foreground">
                  {reservation.venue_name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatReservationSchedule(
                    reservation.starts_at,
                    reservation.ends_at,
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estado: {getReservationStatusLabel(reservation.status)}
                </p>
              </div>
              {reservation.status === 'pending' && (
                <div className="flex flex-wrap gap-2">
                  <form action={confirmReservation.bind(null, reservation.id)}>
                    <Button type="submit" size="sm">
                      Confirmar
                    </Button>
                  </form>
                  <form action={cancelReservation.bind(null, reservation.id)}>
                    <Button type="submit" size="sm" variant="outline">
                      Cancelar
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
