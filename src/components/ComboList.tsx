import type { ComboCategory } from "@/lib/types";

export function ComboList({ data }: { data:ComboCategory[] }) {
    return (
        <>
        <h2 className="text-2xl font-bold">コンボ一覧</h2>

        {data.map((category, idx) => (
            <section key={idx} className="mb-10">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-300">
                    {category.type}
                </h2>
            
            {/* 画面中央や画面端などの基本コンボ表示 */}
            {category.combos?.length ? (
                <div className="space-y-4">
                    {category.combos.map((combo, i) => (
                        <div key={i} className="p-4 border rounded shadow bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-lg">{combo.name}</span>
                            </div>
                            <div className="p-3 border border-gray-300 bg-gray-50 rounded text-lg font-mono mb-2">
                                {combo.sequence || <span className="text^gray-400">-</span>}
                            </div>
                            <div className="text-sm text-gray-700 space-y-1 pl-2">
                                {combo.damage && <p>🟡 {combo.damage}</p>}
                                {combo.frame && <p>🕒 {combo.frame}</p>}
                                {combo.notes && <p>📝メモ: {combo.notes}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500"> (データなし) </p>
            )}

            {/* カウンター限定コンボやパニッシュカウンター限定コンボを入れ子で表示 */}
            {category.groups?.length ? (
                <div className="mt-6 space-y-6">
                    {category.groups.map((group, gi) => (
                        <details key={gi} className="group border rounded">
                            <summary className="cursor-pointer select-none px-4 py-2 font-semibold bg-indigo-50">
                                {group.label} ({group.combos.length})
                            </summary>

                            <div className="p-4 space-y-4">
                                {group.combos.map((combo, ci) => (
                                    <div key={ci} className="p-4 border rounded bg-white">
                                        <div className="p-3 border border-gray-300 bg-gray-50 rounded text-lg font-mono mb-2">
                                            {combo.sequence || <span className="text-gray-400">-</span>}
                                        </div>
                                        <div className="text-sm text-gray-700 space-y-1 pl-2">
                                            {combo.damage && <p>🟡 {combo.damage}</p>}
                                            {combo.frame && <p>🕒 {combo.frame}</p>}
                                            {combo.notes && <p>📝 {combo.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            ) : null}
            </section>
        ))}
    </>
    );
}