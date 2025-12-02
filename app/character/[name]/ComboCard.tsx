'use client'

import { useState, useTransition } from "react"
import { POSITION, STARTER, CONDITION, Position, Starter, Cond } from "@/lib/combos/constants"
import { updateComboAction, deleteComboAction } from "./actions"
import { fdatasync } from "fs"

export type ComboRow = {
    id: string
    character_slug: string
    position: Position
    starter: Starter
    condition: Cond
    combo_text: string
    damage: number
    setup : string[]
    notes: string[]
    sort_order: number
    is_published: boolean
}

export default function ComboCard({ c, canEdit } : { c: ComboRow; canEdit: boolean}) {
    const [editing, setEditing] = useState(false)
    const [pending, start] = useTransition()

    const submit = async (fd: FormData) => {
        start(async () => {
            const res = await updateComboAction(fd)
            if (!res.ok) alert(res.error)
            else setEditing(false)
        })
    }

    const remove = async (fd: FormData) => {
        if (!confirm("このコンボを削除しますか？")) return
        start(async () => {
            const res = await deleteComboAction(fd)
            if (!res.ok) alert(res.error) 
        })
    }

    if (!editing) {
        return (
            <div className="rounded-2xl border p-4 space-y-2">
                <div className="text-sm opacity-70">
                    {POSITION[c.position]} ／ {STARTER[c.starter]} ／ {CONDITION[c.condition]}
                </div>
                <div className="text-lg font-semibold">{c.combo_text}</div>
                <div className="text-sm">DMG; {c.damage}</div>
                {c.setup?.length ? (<div><div className="text-sm font-medium">セットプレイ</div><ul className="list-disc p-5 text-sm">{c.setup.map((s, i)=><li key={i}>{s}</li>)}</ul></div>) : null}
                {c.notes?.length ? (<div><div className="text-sm font-medium">備考</div><ul className="list-disc pl-5 text-sm">{c.notes.map((n,i)=><li key={i}>{n}</li>)}</ul></div>) : null}
                {canEdit && (
                    <div className="pt-2 flex gap-2">
                        <button onClick={() => setEditing(true)} className="rounded-md border px-3 py-1 text-sm">編集</button>
                        <form action={remove}>
                            <input type="hidden" name="id" defaultValue={c.id} />
                            <input type="hidden" name="characterSlug" defaultValue={c.character_slug} />
                            <button className="rounded-md border px-3 py-1 text-sm" disabled={pending}>削除</button>
                        </form>
                    </div>
                )}
            </div>
        )
    }
    return (
    <form action={submit} className="rounded^2xl border p-4 space-y-4">
        <input type="hidden" name="id" defaultValue={c.id} />
        <input type="hidden" name="characterSlug" defaultValue={c.character_slug} />

        <div className="grid grid cols-2 gap-4">
            <div>
                <label className="text-sm">位置</label>
                <select name="position" defaultValue={c.position} className="mt-1 w-full rounded-md border p-2">
                    <option value="mid">中央</option><option value="corner">画面端</option>
                </select>
            </div>
            <div>
                <label className="text-sm">始動技</label>
                <select name="starter" defaultValue={c.starter} className="mt-1 w-full rounded-md border p-2">
                    <option value="light">弱攻撃始動</option><option value="medium">中攻撃始動</option>
                    <option value="heavy">強攻撃始動</option><option value="impact">インパクト</option>
                </select>
            </div>
            <div>
                <label className="text-sm">条件</label>
                <select name="condition" defaultValue={c.condition} className="mt-1 w-full rounded-md border p-2">
                    <option value="normal">通常ヒット</option><option value="counter">カウンターヒット</option>
                    <option value="punish_counter">パニッシュカウンターヒット</option>
                    <option value="wall_splat">壁やられ</option><option value="stun">スタン</option>
                </select>
            </div>
            <div>
                <label className="text-sm">ダメージ</label>
                <input name="damage" type="number" min={0} defaultValue={c.damage} className="mt-1 w-full rounded-md border p-2" />
            </div>

            <div>
                <label className="text-sm">コンボ</label>
                <input name="comboText" defaultValue={c.combo_text} className="mt-1 w-full rounded-md border p-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm">セットプレイ（改行区切り）</label>
                    <textarea name="setup" rows={4} defaultValue={c.setup?.join("\n") ?? ""} className="mt-1 w-full rounded-md border p-2" />
                </div>
                <div>
                    <label className="text-sm">備考（改行区切り）</label>
                    <textarea name="notes" rows={4} defaultValue={c.notes?.join("\n") ?? ""} className="mt-1 w-full rounded-md border p-2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="text-sm">表示順</label>
                <input name="sortOrder" type="number" defaultValue={c.sort_order ?? 0} className="mt-1 w-full rounded-md border p-2" />
            </div>
            <label className="flex items-end gap-2">
                <input type="checkbox" name="publish" className="size-4" />
                <span className="text-sm">公開フラグ</span>
            </label>
        </div>
        
        <div className="flex gap-2">
            <button className="rounded-md border px-4 py-2" disabled={pending}>保存</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-md border px-4 py-2">キャンセル</button>
        </div>
    </form>
    )
}

