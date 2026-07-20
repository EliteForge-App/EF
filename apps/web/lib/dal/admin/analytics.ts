import type { CalendarReservation } from '@/lib/dal/admin/mock-reservations'

export type DayStat = {
  dayIndex: number
  dayLabel: string
  count: number
  topHours: Array<{ hour: number; label: string; count: number }>
}

export type HourStat = {
  hour: number
  label: string
  count: number
}

export type ClientStat = {
  name: string
  total: number
  confirmed: number
  pending: number
  cancelled: number
  cancelRate: number
  fulfillmentRate: number
}

const DAY_LABELS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

function formatHourLabel(hour: number) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:00 ${suffix}`
}

/** Ocupación: pending + confirmed (excluye canceladas). */
function activeReservations(items: CalendarReservation[]) {
  return items.filter((r) => r.status !== 'cancelled')
}

export function computeDayOccupancy(items: CalendarReservation[]): {
  busiest: DayStat[]
  quietest: DayStat[]
  byDay: DayStat[]
} {
  const active = activeReservations(items)
  const dayMap = new Map<number, CalendarReservation[]>()

  for (let i = 0; i < 7; i++) dayMap.set(i, [])

  for (const r of active) {
    const d = new Date(r.starts_at)
    const list = dayMap.get(d.getDay()) ?? []
    list.push(r)
    dayMap.set(d.getDay(), list)
  }

  const byDay: DayStat[] = Array.from({ length: 7 }, (_, dayIndex) => {
    const list = dayMap.get(dayIndex) ?? []
    const hourCounts = new Map<number, number>()
    for (const r of list) {
      const h = new Date(r.starts_at).getHours()
      hourCounts.set(h, (hourCounts.get(h) ?? 0) + 1)
    }
    const topHours = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({
        hour,
        label: formatHourLabel(hour),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    return {
      dayIndex,
      dayLabel: DAY_LABELS[dayIndex],
      count: list.length,
      topHours,
    }
  })

  const sortedBusy = [...byDay].sort((a, b) => b.count - a.count)
  const sortedQuiet = [...byDay].sort((a, b) => a.count - b.count)

  return {
    byDay,
    busiest: sortedBusy.slice(0, 3),
    quietest: sortedQuiet.slice(0, 3),
  }
}

export function computeHourOccupancy(items: CalendarReservation[]): {
  busiestHours: HourStat[]
  quietestHours: HourStat[]
} {
  const active = activeReservations(items)
  const hourCounts = new Map<number, number>()
  for (let h = 8; h <= 22; h++) hourCounts.set(h, 0)

  for (const r of active) {
    const h = new Date(r.starts_at).getHours()
    if (h >= 8 && h <= 22) {
      hourCounts.set(h, (hourCounts.get(h) ?? 0) + 1)
    }
  }

  const all: HourStat[] = Array.from(hourCounts.entries()).map(
    ([hour, count]) => ({
      hour,
      label: formatHourLabel(hour),
      count,
    }),
  )

  return {
    busiestHours: [...all].sort((a, b) => b.count - a.count).slice(0, 5),
    quietestHours: [...all].sort((a, b) => a.count - b.count).slice(0, 5),
  }
}

export function computeClientStats(items: CalendarReservation[]): ClientStat[] {
  const byName = new Map<string, CalendarReservation[]>()

  for (const r of items) {
    const key = r.guest_name.trim() || 'Sin nombre'
    const list = byName.get(key) ?? []
    list.push(r)
    byName.set(key, list)
  }

  return Array.from(byName.entries())
    .map(([name, list]) => {
      const total = list.length
      const confirmed = list.filter((r) => r.status === 'confirmed').length
      const pending = list.filter((r) => r.status === 'pending').length
      const cancelled = list.filter((r) => r.status === 'cancelled').length
      const cancelRate = total === 0 ? 0 : cancelled / total
      const fulfillmentRate = total === 0 ? 0 : (confirmed + pending) / total
      return {
        name,
        total,
        confirmed,
        pending,
        cancelled,
        cancelRate,
        fulfillmentRate,
      }
    })
    .sort((a, b) => b.total - a.total)
}
