import type { ComboCategory } from "@/lib/types";

export function ComboList({ data }: { data:ComboCategory[] }) {
    return (
        <>
        <h2 className="text-2xl font-bold">コンボ一覧</h2>
        {data.map((category, idx) => (
            <section key={idx} className="mb-10">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-300">{category.type}</h2>
                {category.combos.map((combo, i) => (
                    <div key={i} className="mb-6 p-4 border rounded shadow bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-lg">コンボ{i + 1}</span>
                        </div>

                        <div className="p-3 border border-gray-300 bg-gray-50 rounded text-lg font-mono mb-2">
                            {combo.sequence}
                        </div>
                            <div className="text-sm text-gray-700 space-y-1 pl-2">
                                <p>🟡 {combo.damage}dmg</p>
                                <p>🕒 {combo.frame}F</p>
                                <p>📝メモ: {combo.notes}</p>
                            </div>
                    </div>
                ))}
            </section>
        ))}
        </>
    );
}