import type { FrameData } from "@/lib/types";

export function FrameTable({ data }: { data: FrameData[] }) {
    return (
        <div className="overflow-x-auto rounded border mb-8">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1 text-left">技</th>
                        <th className="px-2 py-1 text-center bg-green-200">発生</th>
                        <th className="px-2 py-1 text-center bg-red-200">持続</th>
                        <th className="px-2 py-1 text-center bg-blue-200">硬直</th>
                        <th className="px-2 py-1 text-center">全体</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((move, idx) => (
                        <tr key={idx} className="border-t border-black">
                            <td className="px-2 py-1">{move.name}</td>
                            <td className="px-2 py-1 text-center bg-green-200">{move.start}F</td>
                            <td className="px-2 py-1 text-center bg-red-200">{move.active}F</td>
                            <td className="px-2 py-1 text-center bg-blue-200">{move.end}F</td>
                            <td className="px-2 py-1 text-center">{move.total}F</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}