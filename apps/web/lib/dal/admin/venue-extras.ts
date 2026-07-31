import type { CalendarReservation, CourtSize } from '@/lib/dal/admin/mock-reservations'

export type VenueExtras = {
  price6: number
  price8: number
  price11: number
  courts6: number
  courts8: number
  courts11: number
  hasCafeteria: boolean
  hasTransfers: boolean
  hasBathroom: boolean
  hasWifi: boolean
  hasParking: boolean
  /** Parqueadero gratuito / abierto al público */
  parkingPublic: boolean
  /** Parqueadero de pago */
  parkingPaid: boolean
  hasStands: boolean
}

export const DEFAULT_VENUE_EXTRAS: VenueExtras = {
  price6: 45000,
  price8: 65000,
  price11: 90000,
  courts6: 5,
  courts8: 3,
  courts11: 1,
  hasCafeteria: false,
  hasTransfers: false,
  hasBathroom: true,
  hasWifi: false,
  hasParking: false,
  parkingPublic: false,
  parkingPaid: false,
  hasStands: false,
}

export function venueExtrasKey(venueId: string | undefined) {
  return `ef-venue-extras:${venueId || 'new'}`
}

export function loadVenueExtras(
  venueId: string | undefined,
  fallbackPrice = 45000,
): VenueExtras {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_VENUE_EXTRAS, price6: fallbackPrice }
  }
  try {
    const raw = localStorage.getItem(venueExtrasKey(venueId))
    if (!raw) return { ...DEFAULT_VENUE_EXTRAS, price6: fallbackPrice }
    const parsed = JSON.parse(raw) as Partial<VenueExtras>
    return {
      ...DEFAULT_VENUE_EXTRAS,
      price6: fallbackPrice,
      ...parsed,
      courts6: Math.max(0, Number(parsed.courts6 ?? DEFAULT_VENUE_EXTRAS.courts6)),
      courts8: Math.max(0, Number(parsed.courts8 ?? DEFAULT_VENUE_EXTRAS.courts8)),
      courts11: Math.max(0, Number(parsed.courts11 ?? DEFAULT_VENUE_EXTRAS.courts11)),
      hasCafeteria: Boolean(parsed.hasCafeteria ?? DEFAULT_VENUE_EXTRAS.hasCafeteria),
      hasTransfers: Boolean(parsed.hasTransfers ?? DEFAULT_VENUE_EXTRAS.hasTransfers),
      hasBathroom: Boolean(parsed.hasBathroom ?? DEFAULT_VENUE_EXTRAS.hasBathroom),
      hasWifi: Boolean(parsed.hasWifi ?? DEFAULT_VENUE_EXTRAS.hasWifi),
      hasParking: Boolean(parsed.hasParking ?? DEFAULT_VENUE_EXTRAS.hasParking),
      parkingPublic: Boolean(
        parsed.parkingPublic ?? DEFAULT_VENUE_EXTRAS.parkingPublic,
      ),
      parkingPaid: Boolean(parsed.parkingPaid ?? DEFAULT_VENUE_EXTRAS.parkingPaid),
      hasStands: Boolean(parsed.hasStands ?? DEFAULT_VENUE_EXTRAS.hasStands),
    }
  } catch {
    return { ...DEFAULT_VENUE_EXTRAS, price6: fallbackPrice }
  }
}

export function saveVenueExtras(venueId: string | undefined, extras: VenueExtras) {
  localStorage.setItem(venueExtrasKey(venueId), JSON.stringify(extras))
}

export function totalCourts(extras: Pick<VenueExtras, 'courts6' | 'courts8' | 'courts11'>) {
  return extras.courts6 + extras.courts8 + extras.courts11
}

export type SizeOccupancy = {
  size: CourtSize
  label: string
  capacity: number
  occupied: number
  free: number
  demand: number
}

export type LiveOccupancy = {
  nowLabel: string
  totalCapacity: number
  totalOccupied: number
  totalFree: number
  bySize: SizeOccupancy[]
}

function sizeLabel(size: CourtSize) {
  if (size === '6vs6') return '6 vs 6'
  if (size === '8vs8') return '8 vs 8'
  return '11 vs 11'
}

function capacityFor(
  extras: Pick<VenueExtras, 'courts6' | 'courts8' | 'courts11'>,
  size: CourtSize,
) {
  if (size === '6vs6') return extras.courts6
  if (size === '8vs8') return extras.courts8
  return extras.courts11
}

/** Reservas activas que cruzan el instante `now`. */
export function isReservationLiveNow(
  reservation: CalendarReservation,
  now = new Date(),
) {
  if (reservation.status === 'cancelled') return false
  const start = new Date(reservation.starts_at).getTime()
  const end = new Date(reservation.ends_at).getTime()
  const t = now.getTime()
  return start <= t && t < end
}

export function computeLiveOccupancy(
  extras: Pick<VenueExtras, 'courts6' | 'courts8' | 'courts11'>,
  reservations: CalendarReservation[],
  now = new Date(),
): LiveOccupancy {
  const sizes: CourtSize[] = ['6vs6', '8vs8', '11vs11']
  const live = reservations.filter((r) => isReservationLiveNow(r, now))

  const bySize: SizeOccupancy[] = sizes.map((size) => {
    const capacity = capacityFor(extras, size)
    const demand = live.filter((r) => r.court_size === size).length
    const occupied = Math.min(capacity, demand)
    return {
      size,
      label: sizeLabel(size),
      capacity,
      occupied,
      free: Math.max(0, capacity - occupied),
      demand,
    }
  })

  const totalCapacity = bySize.reduce((n, s) => n + s.capacity, 0)
  const totalOccupied = bySize.reduce((n, s) => n + s.occupied, 0)
  const totalFree = bySize.reduce((n, s) => n + s.free, 0)

  const nowLabel = now.toLocaleString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

  return {
    nowLabel,
    totalCapacity,
    totalOccupied,
    totalFree,
    bySize,
  }
}
