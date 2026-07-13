import { requireAdminSession } from '@/lib/admin/session'
import { AdminPageHeader } from '@/components/admin/page-header'
import { redirect } from 'next/navigation'

export default async function AdminTorneosPage() {
  const session = await requireAdminSession()

  if (session.role === 'Administrador') {
    redirect('/admin/metricas')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <AdminPageHeader
        title="Torneos"
        subtitle="Gestión de ligas y torneos en cancha. Módulo en desarrollo."
      />
      <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
        Aquí podrás crear torneos, abrir inscripciones y vincular partidos
        oficiales con reservas de cancha.
      </p>
    </div>
  )
}
