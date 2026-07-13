export type VenueRow = {
  id: string
  owner_id: string
  name: string
  address: string | null
  price_per_hour_cents: number
  availability: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export type ReservationRow = {
  id: string
  user_id: string
  venue_id: string | null
  venue_name: string
  starts_at: string
  ends_at: string
  status: ReservationStatus
  notes: string | null
  created_at: string
}
