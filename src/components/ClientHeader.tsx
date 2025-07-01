"use client";

import Link from "next/link";
import { useEffect, useState} from "react";
import { useRouter } from "next/router";
import { characters } from "@/lib/characters";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function ClientHeader() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => setOpen(false);
        router.events?.on?.("routeChangeComplete", handleRouteChange);
        return () => {
            router.events?.off?.("routeChangeComplete", handleRouteChange);
        };
    }, [router]);

    return (
        <header className="flex items-center p-4 shadow bg-white sticky top-0 z-50">
            <Sheet open={open} onOpenChange={setOpen}>
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
    );
}