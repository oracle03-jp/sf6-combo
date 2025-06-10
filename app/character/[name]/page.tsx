import { getComboData } from "@/lib/combo-data";
import { notFound } from "next/navigation";
import { characters } from "@/lib/characters";
import type { ComboCategory } from "@/lib/types";

export async function generateStaticParams() {
  return characters.map((char) => ({ name: char.slug })); 
}

export default async function CharacterPage({ params }: { params: { name: string } }) {
    const slug = params.name;

    const char = characters.find((c) => c.slug === slug);
    if (!char) notFound();    
    
    const comboData: ComboCategory[] = await getComboData(char.file);

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold mb-6">{char.displayName} のコンボ</h1>
            {comboData.map((category, idx) => (
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
        </div>
    )
}