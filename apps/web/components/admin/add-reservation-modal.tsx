'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ReservationStatus } from '@/lib/dal/admin/types'
import {
  courtSizeLabel,
  type CalendarReservation,
  type CourtSize,
} from '@/lib/dal/admin/mock-reservations'
import { nativeSelectClassName } from '@/lib/ui/native-select'

const HOUR_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 8)

export type ReservationFormDraft = {
  guest_name: string
  venue_name: string
  court_size: CourtSize
  date: string
  start_hour: number
  duration_hours: number
  status: ReservationStatus
  phone: string
}

export function toDateInputValue(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatHourOption(hour: number) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:00 ${suffix}`
}

function extractPhone(notes: string | null) {
  if (!notes) return ''
  const match = notes.match(/Tel:\s*([^·]+)/i)
  return match?.[1]?.trim() ?? ''
}

/** Href `tel:` usable en móvil/escritorio (limpia espacios y símbolos). */
export function toTelHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, '')
  return normalized.length >= 7 ? `tel:${normalized}` : null
}

export function draftFromReservation(
  reservation: CalendarReservation,
): ReservationFormDraft {
  const start = new Date(reservation.starts_at)
  const end = new Date(reservation.ends_at)
  const durationHours = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000)),
  )
  return {
    guest_name: reservation.guest_name,
    venue_name: reservation.venue_name,
    court_size: reservation.court_size,
    date: toDateInputValue(start),
    start_hour: start.getHours(),
    duration_hours: Math.min(3, durationHours),
    status:
      reservation.status === 'cancelled' ? 'pending' : reservation.status,
    phone: extractPhone(reservation.notes),
  }
}

export function applyDraftToReservation(
  draft: ReservationFormDraft,
  existing?: CalendarReservation,
): CalendarReservation {
  const [y, m, d] = draft.date.split('-').map(Number)
  const starts = new Date(y, m - 1, d, draft.start_hour, 0, 0, 0)
  const ends = new Date(
    starts.getTime() + draft.duration_hours * 60 * 60 * 1000,
  )
  const id =
    existing?.id ??
    `phone-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const phoneNote = `Tel: ${draft.phone.trim()} · Reserva telefónica`

  return {
    id,
    user_id: existing?.user_id ?? `phone-user-${id}`,
    venue_id: existing?.venue_id ?? null,
    venue_name: draft.venue_name.trim() || 'Cancha Elite Demo',
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    status: draft.status,
    notes: phoneNote,
    created_at: existing?.created_at ?? new Date().toISOString(),
    guest_name: draft.guest_name.trim(),
    court_size: draft.court_size,
    is_demo: existing?.is_demo ?? true,
  }
}

const selectClass = nativeSelectClassName

export function ReservationFormModal({
  open,
  mode,
  onClose,
  onSave,
  defaultVenueName,
  defaultDate,
  initial,
}: {
  open: boolean
  mode: 'add' | 'edit'
  onClose: () => void
  onSave: (reservation: CalendarReservation) => void
  defaultVenueName: string
  defaultDate: Date
  initial?: CalendarReservation | null
}) {
  const [guestName, setGuestName] = useState('')
  const [venueName, setVenueName] = useState(defaultVenueName)
  const [courtSize, setCourtSize] = useState<CourtSize>('6vs6')
  const [date, setDate] = useState(toDateInputValue(defaultDate))
  const [startHour, setStartHour] = useState(18)
  const [durationHours, setDurationHours] = useState(1)
  const [status, setStatus] = useState<ReservationStatus>('confirmed')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initial) {
      const draft = draftFromReservation(initial)
      setGuestName(draft.guest_name)
      setVenueName(draft.venue_name)
      setCourtSize(draft.court_size)
      setDate(draft.date)
      setStartHour(draft.start_hour)
      setDurationHours(draft.duration_hours)
      setStatus(draft.status)
      setPhone(draft.phone)
    } else {
      setGuestName('')
      setVenueName(defaultVenueName)
      setCourtSize('6vs6')
      setDate(toDateInputValue(defaultDate))
      setStartHour(18)
      setDurationHours(1)
      setStatus('confirmed')
      setPhone('')
    }
    setError(null)
  }, [open, mode, initial, defaultVenueName, defaultDate])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const callHref = toTelHref(phone)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (guestName.trim().length < 2) {
      setError('Ingresa el nombre de quien reserva.')
      return
    }
    if (phone.trim().replace(/[^\d]/g, '').length < 7) {
      setError('Ingresa un teléfono válido (mínimo 7 dígitos).')
      return
    }
    if (!date) {
      setError('Selecciona la fecha.')
      return
    }
    if (startHour + durationHours > 23) {
      setError('El horario debe terminar a las 10 PM o antes.')
      return
    }

    const reservation = applyDraftToReservation(
      {
        guest_name: guestName,
        venue_name: venueName,
        court_size: courtSize,
        date,
        start_hour: startHour,
        duration_hours: durationHours,
        status,
        phone,
      },
      mode === 'edit' ? initial ?? undefined : undefined,
    )
    onSave(reservation)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-form-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {mode === 'edit' ? 'Editar reserva' : 'Reserva telefónica'}
            </p>
            <h2
              id="reservation-form-title"
              className="mt-1 font-heading text-2xl font-bold text-foreground"
            >
              {mode === 'edit' ? 'Modificar reserva' : 'Añadir reserva'}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === 'edit'
                ? 'Cambia formato, fecha, horario, nombre o estado.'
                : 'Para citas gestionadas por llamada (no vienen de la app).'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest_name">Nombre del jugador</Label>
            <Input
              id="guest_name"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ej. Pedro Sánchez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="300 123 4567"
                className="flex-1"
              />
              {callHref ? (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 gap-2"
                  render={
                    <a href={callHref} aria-label={`Llamar a ${phone}`} />
                  }
                >
                  <Phone className="h-4 w-4" />
                  Llamar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 gap-2"
                  disabled
                  title="Ingresa un teléfono válido para llamar"
                >
                  <Phone className="h-4 w-4" />
                  Llamar
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue_name">Cancha / complejo</Label>
            <Input
              id="venue_name"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="court_size">Formato de cancha</Label>
            <select
              id="court_size"
              className={selectClass}
              value={courtSize}
              onChange={(e) => setCourtSize(e.target.value as CourtSize)}
            >
              <option value="6vs6">{courtSizeLabel('6vs6')}</option>
              <option value="8vs8">{courtSizeLabel('8vs8')}</option>
              <option value="11vs11">{courtSizeLabel('11vs11')}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                className={selectClass}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ReservationStatus)
                }
              >
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_hour">Hora de inicio</Label>
              <select
                id="start_hour"
                className={selectClass}
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <option key={hour} value={hour} disabled={hour >= 22}>
                    {formatHourOption(hour)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración</Label>
              <select
                id="duration"
                className={selectClass}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
              >
                <option value={1}>1 hora</option>
                <option value={2}>2 horas</option>
                <option value={3}>3 horas</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit">
              {mode === 'edit' ? 'Guardar cambios' : 'Guardar reserva'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/** Compatibilidad: añadir reserva telefónica */
export function AddReservationModal({
  open,
  onClose,
  onSave,
  defaultVenueName,
  defaultDate,
}: {
  open: boolean
  onClose: () => void
  onSave: (reservation: CalendarReservation) => void
  defaultVenueName: string
  defaultDate: Date
}) {
  return (
    <ReservationFormModal
      open={open}
      mode="add"
      onClose={onClose}
      onSave={onSave}
      defaultVenueName={defaultVenueName}
      defaultDate={defaultDate}
    />
  )
}
