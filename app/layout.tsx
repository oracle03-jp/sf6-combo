import "../src/styles/globals.css";
import Link from "next/link";
import { characters } from "@/lib/characters";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import React from "react";

export const metadata = {
    title: "SF6コンボまとめ",
    description: "STREETFIGHTER6のキャラ別コンボサイト",
}

export default function RootLayout({ children }: { children: React.ReactNode}) {
    return (
        <html lang="ja">
            <body className="bg-gray-100 text-gray-800">
                <header className="flex items-center p-4 shadow bg-white sticky top-0 z-50">
                    <Sheet>
                        <SheetTrigger className="mr-4 p-2 rounded hover:bg-gray-200">
                            <Menu className="w-6 h-6" />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] bg-white">
                            <SheetHeader>
                                <SheetTitle>キャラ一覧</SheetTitle>
                            </SheetHeader>
                            <ul className="space y-2">
                                {characters.map((char) => (
                                    <li key={char.slug}>
                                        <Link href={`/character/${char.slug}`} className="text-blue-600 hover:underline">
                                            {char.displayName}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-xl font-bold">SF6 コンボまとめ</h1>
                </header>
                <main className="max-w-4xl mx-auto p-6">{children}</main>
            </body>
        </html>
    )
}