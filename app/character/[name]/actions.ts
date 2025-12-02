'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function parseDamage(input: FormDataEntryValue | null): number {
  const n = Number(input ?? 0)
  return Number.isFinite(n) ? n : 0
}

export async function createComboAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'ログインが必要です。' }

  const slug = String(formData.get('characterSlug') ?? '')
  const damage = parseDamage(formData.get('damage'))

  const payload = {
    character_slug: slug,
    position: String(formData.get('position') ?? ''),
    starter: String(formData.get('starter') ?? ''),
    condition: String(formData.get('condition') ?? ''),
    combo_text: String(formData.get('comboText') ?? '').trim(),
    damage,
    setup: String(formData.get('setup') ?? '')
      .split('\n').map(s => s.trim()).filter(Boolean),
    notes: String(formData.get('notes') ?? '')
      .split('\n').map(s => s.trim()).filter(Boolean),
    sort_order: Number(formData.get('sortOrder') ?? 0) || 0,
    is_published: formData.get('publish') === 'on', // RLSがadminのみ許可
    created_by: user.id,
  }

  if (!payload.combo_text || !payload.damage) {
    return { ok: false as const, error: 'コンボとDMGは必須項目です。' }
  }

  const { error } = await supabase.from('combos').insert(payload)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath(`/character/${slug}`)
  return { ok: true as const }
}

export async function updateComboAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'ログインが必要です。' }

  const id = String(formData.get('id') ?? '')
  const slug = String(formData.get('characterSlug') ?? '')
  const damage = parseDamage(formData.get('damage'))

  const patch: any = {
    position: String(formData.get('position') ?? ''),
    starter: String(formData.get('starter') ?? ''),
    condition: String(formData.get('condition') ?? ''),
    combo_text: String(formData.get('comboText') ?? '').trim(),
    damage,
    setup: String(formData.get('setup') ?? '')
      .split('\n').map(s => s.trim()).filter(Boolean),
    notes: String(formData.get('notes') ?? '')
      .split('\n').map(s => s.trim()).filter(Boolean),
    sort_order: Number(formData.get('sortOrder') ?? 0) || 0,
  }

  if (formData.get('publish') != null) {
    patch.is_published = formData.get('publish') === 'on'
  }

  if (!patch.combo_text || !patch.damage) {
    return { ok: false as const, error: 'コンボとDMGは必須項目です。' }
  }

  const { error } = await supabase.from('combos').update(patch).eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath(`/character/${slug}`)
  return { ok: true as const }
}

export async function deleteComboAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'ログインが必要です。' }

  const id = String(formData.get('id') ?? '')
  const slug = String(formData.get('characterSlug') ?? '')

  const { error } = await supabase.from('combos').delete().eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath(`/character/${slug}`)
  return { ok: true as const }
}
