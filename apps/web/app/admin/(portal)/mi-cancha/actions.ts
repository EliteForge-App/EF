'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/admin/session'
import { upsertMyVenue } from '@/lib/dal/admin/venues'

export async function saveVenue(formData: FormData) {
  const session = await requireAdminSession()
  const id = String(formData.get('id') || '').trim() || undefined
  const name = String(formData.get('name') || '').trim()
  const address = String(formData.get('address') || '').trim()
  const price = Number(formData.get('price_per_hour') || 0)

  if (!name) {
    throw new Error('El nombre de la cancha es obligatorio')
  }

  await upsertMyVenue(session.user.id, {
    id,
    name,
    address: address || null,
    price_per_hour_cents: Math.round(price * 100),
  })

  revalidatePath('/admin/mi-cancha')
  revalidatePath('/admin')
}
