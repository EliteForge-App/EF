'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  BarChart3,
  Trophy,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { AdminLogoutButton } from '@/components/admin/logout-button'
import type { AdminRole } from '@/lib/admin/roles'

const courtNav = [
  { label: 'Resumen', href: '/admin', icon: LayoutDashboard },
  { label: 'Reservas', href: '/admin/reservas', icon: CalendarDays },
  { label: 'Mi cancha', href: '/admin/mi-cancha', icon: Building2 },
  { label: 'Torneos', href: '/admin/torneos', icon: Trophy },
]

const adminNav = [
  { label: 'Resumen', href: '/admin', icon: LayoutDashboard },
  { label: 'Métricas', href: '/admin/metricas', icon: BarChart3 },
]

function getNav(role: AdminRole) {
  if (role === 'Administrador') return adminNav
  return courtNav
}

export function AdminSidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname()
  const nav = getNav(role)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4 lg:flex">
      <div className="px-2 py-2">
        <Link href="/admin">
          <Logo />
        </Link>
        <p className="mt-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
          Portal Admin
        </p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border pt-2">
        <AdminLogoutButton />
      </div>
    </aside>
  )
}
