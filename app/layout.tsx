import "../src/styles/globals.css";

import ClientHeader from "@/components/ClientHeader";

export const metadata = {
    title: "SF6コンボまとめ",
    description: "STREETFIGHTER6のキャラ別コンボサイト",
}

export default function RootLayout({ children }: { children: React.ReactNode}) {
    return (
        <html lang="ja">
            <body className="bg-gray-100 text-gray-800">
                <ClientHeader />
                <main className="max-w-4xl mx-auto p-6">{children}</main>
            </body>
        </html>
    )
}