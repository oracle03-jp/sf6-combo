import { getComboData } from "@/lib/combo-data";
import { notFound } from "next/navigation";
import { characters } from "@/lib/characters";
import type { Combo } from "@/lib/types";

export async function generateStaricParams() {
    return characters.map((name) => ({ name }));
}

export default async function CharacterPage({ params }: { params: { name: string } }) {
    const { name } = params;
    if (!characters.includes(name as any)) notFound();
    
    const comboData: Combo[] = await getComboData(name);

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{name}のコンボまとめ</h1>
            <ul className="list-disc pl-6 space-y-2">
                {comboData.map((combo, i) => (
                    <li key={i}>
                        <strong>{combo.title}</strong>: {combo.description}
                    </li>
                ))}
            </ul>
        </div>
    )
}