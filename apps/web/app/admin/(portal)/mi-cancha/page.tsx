import { requireAdminSession } from '@/lib/admin/session'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getMyPrimaryVenue } from '@/lib/dal/admin/venues'
import { saveVenue } from '@/app/admin/(portal)/mi-cancha/actions'
import { redirect } from 'next/navigation'

export default async function MiCanchaPage() {
  const session = await requireAdminSession()

  if (session.role === 'Administrador') {
    redirect('/admin/metricas')
  }

  let venue: Awaited<ReturnType<typeof getMyPrimaryVenue>> = null
  let loadError: string | null = null

  try {
    venue = await getMyPrimaryVenue(session.user.id)
  } catch {
    loadError = 'No se pudo cargar la cancha. Verifica que el backend esté activo.'
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <AdminPageHeader
        title="Mi cancha"
        subtitle="Datos básicos, precio por hora y operación."
      />

      {loadError && (
        <p className="mb-4 text-sm text-destructive">{loadError}</p>
      )}

      <form action={saveVenue} className="space-y-4">
        <input type="hidden" name="id" value={venue?.id ?? ''} />

        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la cancha</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={venue?.name ?? ''}
            placeholder="Complejo El Estadio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            defaultValue={venue?.address ?? ''}
            placeholder="Calle, ciudad"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_per_hour">Precio por hora (COP)</Label>
          <Input
            id="price_per_hour"
            name="price_per_hour"
            type="number"
            min={0}
            step={1000}
            defaultValue={
              venue ? Math.round(venue.price_per_hour_cents / 100) : 45000
            }
          />
        </div>

        <Button
          type="submit"
          className="font-heading font-semibold uppercase tracking-wide"
        >
          Guardar cancha
        </Button>
      </form>
    </div>
  )
}
