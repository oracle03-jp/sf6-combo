'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { BookLock } from "lucide-react"
import { CLIENT_PUBLIC_FILES_PATH } from "next/dist/shared/lib/constants"
import { errorMonitor } from "events"
import { execOnce } from "next/dist/shared/lib/utils"
import { error } from "console"

export async function createComboAction(formData: FormData) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    const uid = user.user?.id
    if (!uid) return { ok: false, error: "ログインが必要です。" }

    const slug = String(formData.get("characterSlug"))
    const payload = {
        character_slug: slug,
        position: String(formData.get("position")),
        starter: String(formData.get("starter")),
        condition: String(formData.get("condition")),
        combo_text: String(formData.get("comboText") ?? "").trim(),
        damage: Number(formData.get("damage") ?? 0),
        setup: String(formData.get("setup") ?? "").split("\n").map(s => s.trim()).filter(Boolean),
        notes: String(formData.get("notes") ?? "").split("\n").map(s => s.trim()).filter(Boolean),
        sort_order: Number(formData.get("sortOrder") ?? 0),
        is_published: formData.get("publish") === "on",
        created_by: uid,
    }

    if (!payload.combo_text || payload.damage) return { ok: false, error: "コンボとDMGは必須項目です。" }

    const { error } = await supabase.from("combos").insert(payload)
    if (error) return { ok: false, error: error.message }

    revalidatePath(`/character/${slug}`)
    return { ok: true }
}

export async function updateComboAction(formData: FormData) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.id) return { ok: false, error: "ログインが必要です。" }

    const id = String(formData.get("id"))
    const slug = String(formData.get("characterSlug"))
    const payload = {
        position: String(formData.get("position")),
        starter: String(formData.get("starter")),
        condition: String(formData.get("condition")),
        combo_text: String(formData.get("comboText") ?? "").trim(),
        damage: Number(formData.get("damage") ?? 0),
        setup: String(formData.get("setup") ?? "").split("\n").map(s => s.trim()).filter(Boolean),
        notes: String(formData.get("notes") ?? "").split("\n").map(s => s.trim()).filter(Boolean),
        sort_order: Number(formData.get("sortOrder") ?? 0),
        is_published: formData.get("publish") === "on",
    }

    if (!payload.combo_text || !payload.damage) return { ok: false, error: "コンボとDMGは必須項目です。" }

    const { error } = await supabase.from("combos").update(payload).eq("id", id)
    if (error) return { ok: false, error: error.message }

    revalidatePath(`/character/${slug}`)
    return { ok: true }
}

export async function deleteComboAction(formData: FormData) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.id) return { ok: false, error: "ログインが必要です。" }

    const id = String(formData.get("id"))
    const slug = String(formData.get("characterSlug"))

    const { error } = await supabase.from("combos").delete().eq("id", id)
    if (error) return { ok: false, error: error.message }

    revalidatePath(`/character/${slug}`)
    return { ok: true }
}