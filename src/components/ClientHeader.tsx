"use client";

import Link from "next/link";
import { useCallback, useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import { characters } from "@/lib/characters";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
    display_name: string | null;
    role: "user" | "admin";
    avatar_url: string | null;
};

export default function ClientHeader() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const load = useCallback(async () => {
        const supabase = createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

         if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("display_name, role, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    setProfile({
                        display_name: data.display_name,
                        role: data.role,
                        avatar_url: data.avatar_url,
                    });
                }
            } else {
                setProfile(null);
            }

            setReady(true);
    }, []);

    // ログイン状態 & プロフィール取得
    useEffect(() => {
        const supabase = createClient();

        load();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            load();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [load]);

    useEffect(() => {
        const onUpdated = () => load();
        window.addEventListener("profile-updated", onUpdated);
        return () => window.removeEventListener("profile-updated", onUpdated)
    }, [load]);

    const displayName = profile?.display_name || (user?.email ? user.email.split("@")[0] : "Player");

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow">
            <div className="flex items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger className="mr-1 rounded p-2 hover:bg-gray-200">
                        <Menu className="h-6 w-6" />
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[240px] bg-white p-0">
                        <div className="h-full flex flex-col">
                        <SheetHeader className="p-4">
                            <SheetTitle>キャラ一覧</SheetTitle>
                        </SheetHeader>
                        <ul className="space-y-2 overflow-y-auto px-4 pb-4"
                            style={{ maxHeight: "calc(100vh - 80px)" }}
                        >
                            {characters.map((char) => (
                                <li key={char.slug}>
                                    <Link
                                    href={`/character/${char.slug}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {char.displayName}
                                </Link>
                                </li>
                            ))}
                        </ul>
                        </div>
                    </SheetContent>
                        
                </Sheet>
                <Link href="/">
                    <h1 className="text-xl font-bold">Street Fighter6 コンボまとめ</h1>
                </Link>
            </div>

            <nav className="flex items-center gap-3 text-sm">
                {!ready ? null :user ? (
                    // ログイン済み: プロフィールアイコン
                    <Link 
                        href="/profile"
                        className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50"
                    >
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="avatar"
                                className="h-8 w-8 rounded-full object-center"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                                {initial}
                            </div>
                        )}
                        <span className="hidden sm:inline">
                            {displayName}
                            {profile?.role === "admin" && " (admin) "}
                        </span>
                    </Link>
                ) : (
                    // 未ログイン: ログイン / サインアップ
                    <>
                        <Link
                            href="/login"
                            className="rounded-full bg-black px-3 py-1 text-white hover:opacity-80"
                        >
                            ログイン / サインアップ
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}