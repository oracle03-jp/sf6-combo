import { getComboData } from "@/lib/combo-data";
import { notFound } from "next/navigation";
import { characters } from "@/lib/characters";
import type { ComboCategory, FrameData } from "@/lib/types";
import { ComboList } from "@/components/ComboList";
import { FrameTable } from "@/components/FrameTable";
import { getFrameData } from "@/lib/frame-data";

export async function generateStaticParams() {
  return characters.map((char) => ({ name: char.slug })); 
}

export default async function CharacterPage({ params }: { params: { name: string } }) {
    const slug = params.name;

    const char = characters.find((c) => c.slug === slug);
    if (!char) notFound();    
    
    const comboData: ComboCategory[] = await getComboData(char.file);
    const frameData: FrameData[] = await getFrameData(char.file);

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{char.displayName}の基本技フレーム</h1>
            {frameData?.length ? (
                <FrameTable data={frameData} />
            ) : (
                <p className="text-sm text-gray-500">※鋭意作成中</p>
            )}
            <h1 className="text-3xl font-bold mb-6">{char.displayName}のコンボ</h1>
            <ComboList data={comboData} />
        </div>
    )
}