import { AdminSidebar } from '@/components/admin/sidebar'
import { isDevBypassSessionActive } from '@/lib/admin/dev-bypass'
import { requireAdminSession } from '@/lib/admin/session'

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdminSession()
  const devBypass = await isDevBypassSessionActive()

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar role={session.role} devBypass={devBypass} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
