'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/admin/session'
import { updateReservationStatusAsOwner } from '@/lib/dal/admin/reservations'
import type { ReservationStatus } from '@/lib/dal/admin/types'

export async function setReservationStatus(
  reservationId: string,
  status: ReservationStatus,
) {
  const session = await requireAdminSession()
  await updateReservationStatusAsOwner(session.user.id, reservationId, status)
  revalidatePath('/admin/reservas')
  revalidatePath('/admin')
}

export async function confirmReservation(reservationId: string) {
  await setReservationStatus(reservationId, 'confirmed')
}

export async function cancelReservation(reservationId: string) {
  await setReservationStatus(reservationId, 'cancelled')
}
