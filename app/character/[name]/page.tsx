import { getComboData } from "@/lib/combo-data";
import { notFound } from "next/navigation";
import { characters } from "@/lib/characters";
import type { Combo, ComboGroup, ComboCategory, FrameData } from "@/lib/types";
import { ComboList } from "@/components/ComboList";
import { getFrameData } from "@/lib/frame-data";

import { createClient } from "@/lib/supabase/server";
import { getMyRole } from "@/lib/supabase/role";
import ComboCard from "./ComboCard";
import { createComboAction } from "./actions";
import type { ComboRow } from "./ComboCard";

type DBCombo = {
    id: string
    character_slug: string
    position: "mid" | "corner"
    starter: "light" | "medium" | "heavy" | "impact"
    condition: "normal" | "counter" | "punish_counter" | "wall_splat" | "stun"
    combo_text: string
    damage: number
    setup: string[] | null
    notes: string[] | null
    sort_order: number | null
    is_published: boolean
}

const POS_LABEL: Record<DBCombo["position"], string> = { mid: "中央", corner: "画面端" }
const STA_LABEL: Record<DBCombo["starter"], string> = {
    light: "弱攻撃始動",
    medium: "中攻撃始動",
    heavy: "強攻撃始動",
    impact: "インパクト",
}
const CON_LABEL: Record<DBCombo["condition"], string> = {
    normal: "通常ヒット",
    counter: "カウンターヒット",
    punish_counter: "パニッシュカウンターヒット",
    wall_splat: "壁やられ",
    stun: "スタン",
}

function adaptToComboCategories(rows: DBCombo[]): ComboCategory[] {
    const buckets = new Map<string, Map<string, DBCombo[]>>()

    for (const r of rows) {
        const catKey = `${POS_LABEL[r.position]}／${STA_LABEL[r.starter]}`
        const cond = CON_LABEL[r.condition]

        if (!buckets.has(catKey)) buckets.set(catKey, new Map<string, DBCombo[]>())
        const condMap = buckets.get(catKey)!
        if (!condMap.has(cond)) condMap.set(cond, [])
        condMap.get(cond)!.push(r)
    }

    const categories: ComboCategory[] = []

    for (const [catKey, condMap] of buckets.entries()) {
        const groups: ComboGroup[] = []

        for (const [label, list] of condMap.entries()) {
            const combos: Combo[] = list
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((r) => ({
                sequence: r.combo_text,
                damage: String(r.damage),
                notes: [
                    ...(r.setup ?? []).map((s) => ` 【セットプレイ】 ${s}`),
                    ...(r.notes ?? []).map((n) => ` 【備考】 ${n}`),
                ].join("\n") || undefined,
            }))
            
            groups.push({ label: label, combos })
        }

        categories.push({ type: catKey, groups })
    }

    return categories
}

export async function createComboActionForForm(fd: FormData): Promise<void> {
  'use server'
  await createComboAction(fd)
}

export async function generateStaticParams() {
  return characters.map((char) => ({ name: char.slug })); 
}

export default async function CharacterPage({ params }: { params: { name: string } }) {
    const slug = params.name;

    const char = characters.find((c) => c.slug === slug);
    if (!char) notFound();    
    
    const supabase = createClient()
    const role = await getMyRole()
    const isAdmin = role === "admin"

    const base = supabase
        .from("combos")
        .select("*")
        .eq("character_slug", slug)
        .order("position")
        .order("starter")
        .order("condition")
        .order("sort_order")

    const { data: rows, error } = isAdmin ? await base : await base.eq("is_published", true)
    if (error) console.error("[combos] fetch error:", error)
    const rawRows: DBCombo[] = (rows ?? []) as DBCombo[] 

    const comboRows: ComboRow[] = rawRows.map((r) => ({
        id: r.id,
        character_slug: r.character_slug,
        position: r.position,
        starter: r.starter,
        condition: r.condition,
        combo_text: r.combo_text,
        damage: r.damage,
        setup: r.setup ?? [],
        notes: r.notes ?? [],
        sort_order: r.sort_order ?? 0, 
        is_published: r.is_published,
    }))

    // 閲覧UI用データ
    const comboData: ComboCategory[] = adaptToComboCategories(rawRows)

    // 認証状態（下書き作成の可否）
    const { data: { user } } = await supabase.auth.getUser()
    const canCreate = true
    const canEditAdmin = isAdmin

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{char.displayName}のコンボ</h1>

            <ComboList data={comboData} />

            {canCreate && (
                <form action={createComboActionForForm} className="rounded-2xl border p-4 space-y-4">
                    <input type="hidden" name="characterSlug" defaultValue={slug} />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">位置</label>
                            <select name="position" className="mt-1 w-full rounded-md border p-2">
                                <option value="mid">中央</option>
                                <option value="corner">画面端</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">始動</label>
                            <select name="starter" className="mt-1 w-full rounded-md border p-2">
                                <option value="light">弱攻撃始動</option>
                                <option value="medium">中攻撃始動</option>
                                <option value="heavy">強攻撃始動</option>
                                <option value="impact">インパクト</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">条件</label>
                            <select name="condition"className="mt-1 w-full rounded-md border p-2">
                                <option value="normal">通常ヒット</option>
                                <option value="counter">カウンターヒット</option>
                                <option value="punish_counter">パニッシュカウンターヒット</option>
                                <option value="wall_splat">壁やられ</option>
                                <option value="stun">スタン</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">ダメージ</label>
                            <input
                                name="damage"
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded-md border p-2"
                                placeholder="1200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm">コンボ</label>
                        <input
                            name="comboText"
                            className="mt-1 w-full rounded-md border p-2"
                            placeholder="小技x3 > 弱忍蜂"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">セットプレイ（改行区切り）</label>
                            <textarea name="setup" rows={4} className="mt-1 w-gull rounded-md border p-2" />
                        </div>
                        <div>
                            <label className="text-sm">備考（改行区切り）</label>
                            <textarea name="notes" rows={4} className="mt-1 w-gull rounded-md border p-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">表示順</label>
                            <input
                                name="sortOrder"
                                type="number"
                                defaultValue={0}
                                className="mt-1 w-full rounded-md border p-2"
                            />
                        </div>
                        <label className="flex items-end gap-2">
                            <input type="checkbox" name="publish" className="size-4" disabled={!isAdmin} />
                            <span className="text-sm">公開フラグ{!isAdmin && " (adminのみ) "}</span>
                        </label>

                        <button className="rounded-md border px-4 py-2">登録する</button>
                    </div>
                </form>
            )}

            {/* 編集カード（adminは公開切替可 / userは自分の下書きのみRLSで編集可） */}
            {rawRows.length > 0 && (
                <div className="space-y-4">
                    {comboRows.map((c) => (
                        <ComboCard key={c.id} c={c} canEdit={canEditAdmin} />
                    ))}
                    </div>
            )}
        </div>
    )
}