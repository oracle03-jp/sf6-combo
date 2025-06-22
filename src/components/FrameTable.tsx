import type { FrameData } from "@/lib/types";

export function FrameTable({ data }: { data: FrameData[] }) {
    return (
        <div className="overflow-x-auto rounded border mb-8">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1 text-left">技</th>
                        <th className="px-2 py-1 text-center">発生</th>
                        <th className="px-2 py-1 text-center">持続</th>
                        <th className="px-2 py-1 text-center">硬直</th>
                        <th className="px-2 py-1 text-center">全体</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((move, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="px-2 py-1">{move.name}</td>
                            <td className="px-2 py-1 text-center">{move.start}</td>
                            <td className="px-2 py-1 text-center">{move.active}</td>
                            <td className="px-2 py-1 text-center">{move.end}</td>
                            <td className="px-2 py-1 text-center">{move.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}