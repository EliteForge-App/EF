import type { ReservationRow, ReservationStatus } from '@/lib/dal/admin/types'

export type CourtSize = '6vs6' | '8vs8' | '11vs11'

export type CalendarReservation = ReservationRow & {
  guest_name: string
  court_size: CourtSize
  is_demo?: boolean
}

const MOCK_NAMES = [
  'Carlos Mendoza',
  'Ana Sofía Ruiz',
  'Diego Parra',
  'Valentina Gómez',
  'Andrés Castillo',
  'Laura Mejía',
  'Sebastián Ortiz',
  'Camila Restrepo',
  'Juan Pablo Torres',
  'María Fernanda López',
  'Mateo Vargas',
  'Isabella Díaz',
] as const

const SEED_META: Record<
  string,
  { name: string; court_size: CourtSize }
> = {
  '00000000-0000-4000-8000-000000000101': {
    name: 'Carlos Mendoza',
    court_size: '6vs6',
  },
  '00000000-0000-4000-8000-000000000102': {
    name: 'Ana Sofía Ruiz',
    court_size: '8vs8',
  },
}

function hashIndex(id: string, mod: number) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997
  return h % mod
}

function atLocalDay(base: Date, dayOffset: number, hour: number, minute = 0) {
  const d = new Date(base)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d
}

/**
 * Reservas inventadas en distintos días/horarios (solo UI).
 * Relativas a "hoy" para que siempre sean visibles en el calendario.
 */
export function buildDemoReservations(venueName = 'Cancha Elite Demo'): CalendarReservation[] {
  const today = new Date()
  const specs: Array<{
    id: string
    name: string
    dayOffset: number
    startHour: number
    durationHours: number
    status: ReservationStatus
    court_size: CourtSize
  }> = [
    {
      id: 'demo-ui-001',
      name: 'Diego Parra',
      dayOffset: 0,
      startHour: 9,
      durationHours: 1,
      status: 'confirmed',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-002',
      name: 'Valentina Gómez',
      dayOffset: 0,
      startHour: 16,
      durationHours: 2,
      status: 'pending',
      court_size: '8vs8',
    },
    {
      id: 'demo-ui-003',
      name: 'Andrés Castillo',
      dayOffset: 1,
      startHour: 10,
      durationHours: 1,
      status: 'confirmed',
      court_size: '11vs11',
    },
    {
      id: 'demo-ui-004',
      name: 'Laura Mejía',
      dayOffset: 1,
      startHour: 19,
      durationHours: 1,
      status: 'cancelled',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-005',
      name: 'Sebastián Ortiz',
      dayOffset: 2,
      startHour: 8,
      durationHours: 2,
      status: 'pending',
      court_size: '8vs8',
    },
    {
      id: 'demo-ui-006',
      name: 'Camila Restrepo',
      dayOffset: 3,
      startHour: 14,
      durationHours: 1,
      status: 'confirmed',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-007',
      name: 'Juan Pablo Torres',
      dayOffset: 4,
      startHour: 20,
      durationHours: 2,
      status: 'pending',
      court_size: '11vs11',
    },
    {
      id: 'demo-ui-008',
      name: 'María Fernanda López',
      dayOffset: 5,
      startHour: 11,
      durationHours: 1,
      status: 'confirmed',
      court_size: '8vs8',
    },
    {
      id: 'demo-ui-009',
      name: 'Mateo Vargas',
      dayOffset: -1,
      startHour: 17,
      durationHours: 1,
      status: 'cancelled',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-010',
      name: 'Isabella Díaz',
      dayOffset: 6,
      startHour: 15,
      durationHours: 2,
      status: 'confirmed',
      court_size: '11vs11',
    },
    // 5 canchas 6vs6 a la misma hora (hoy 18:00) — prueba de UI concurrente
    {
      id: 'demo-ui-c1',
      name: 'Pedro Sánchez',
      dayOffset: 0,
      startHour: 18,
      durationHours: 1,
      status: 'confirmed',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-c2',
      name: 'Lucía Hernández',
      dayOffset: 0,
      startHour: 18,
      durationHours: 1,
      status: 'pending',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-c3',
      name: 'Ricardo Gómez',
      dayOffset: 0,
      startHour: 18,
      durationHours: 1,
      status: 'confirmed',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-c4',
      name: 'Sofía Ramírez',
      dayOffset: 0,
      startHour: 18,
      durationHours: 1,
      status: 'pending',
      court_size: '6vs6',
    },
    {
      id: 'demo-ui-c5',
      name: 'Felipe Navarro',
      dayOffset: 0,
      startHour: 18,
      durationHours: 1,
      status: 'confirmed',
      court_size: '6vs6',
    },
  ]

  return specs.map((spec) => {
    const starts = atLocalDay(today, spec.dayOffset, spec.startHour)
    const ends = new Date(starts.getTime() + spec.durationHours * 60 * 60 * 1000)
    return {
      id: spec.id,
      user_id: `demo-user-${spec.id}`,
      venue_id: null,
      venue_name: venueName,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      status: spec.status,
      notes: spec.name,
      created_at: today.toISOString(),
      guest_name: spec.name,
      court_size: spec.court_size,
      is_demo: true,
    }
  })
}

export function enrichReservationsForCalendar(
  rows: ReservationRow[],
): CalendarReservation[] {
  const fromApi: CalendarReservation[] = rows.map((row) => {
    const seed = SEED_META[row.id]
    const sizes: CourtSize[] = ['6vs6', '8vs8', '11vs11']
    return {
      ...row,
      guest_name:
        seed?.name ??
        MOCK_NAMES[hashIndex(row.id, MOCK_NAMES.length)],
      court_size: seed?.court_size ?? sizes[hashIndex(row.id, sizes.length)],
      is_demo: false,
    }
  })

  const venueName = rows[0]?.venue_name ?? 'Cancha Elite Demo'
  const demos = buildDemoReservations(venueName)

  // Evitar duplicar si demos ya estuvieran en API (por id)
  const apiIds = new Set(fromApi.map((r) => r.id))
  const uniqueDemos = demos.filter((d) => !apiIds.has(d.id))

  return [...fromApi, ...uniqueDemos].sort(
    (a, b) =>
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  )
}

export function courtSizeLabel(size: CourtSize) {
  if (size === '6vs6') return '6 vs 6'
  if (size === '8vs8') return '8 vs 8'
  return '11 vs 11'
}
