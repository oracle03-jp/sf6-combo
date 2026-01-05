"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
    const [displayName, setDisplayName] = useState("")
    const [role, setRole] = useState<"user" | "admin" | "">("")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    useEffect(() => {
        const supabase = createClient()

        ;(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("display_name, role, avatar_url")
                .eq("id", user.id)
                .single()

            if (!error && data) {
                setDisplayName(data.display_name ?? "")
                setRole(data.role);
                setAvatarPreview(data.avatar_url ?? null);
            }

            setLoading(false);
        })();
    }, [router]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        try { 
            let avatarUrlToSave: string | null = null;

            if (avatarFile) {
                const ext = avatarFile.name.split(".").pop() || "png";
                const path = `${user.id}/avatar.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(path, avatarFile, { upsert: true });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from("avatars").getPublicUrl(path);
                avatarUrlToSave = data.publicUrl;

                setAvatarPreview(avatarUrlToSave);
                setAvatarFile(null);
            }

            const payload: { display_name: string; avatar_url?: string } = {
                display_name: displayName,
            };
            if (avatarUrlToSave) payload.avatar_url = avatarUrlToSave;

            const { error } = await supabase
                .from("profiles")
                .update(payload)
                .eq("id", user.id);

            if (error) throw error;

            setMessage("プロフィールを保存しました。");

            window.dispatchEvent(new Event("profile-updated"));
            router.refresh();
        } catch (err: any) {
            setMessage(err.message ?? "保存に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    const  handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    };

    if (loading) {
        return <div className="p-6">読みこみ中...</div>
    }

    return (
        <div className="mx-auto max-w-md space-y-6 rounded-2xl border bg-white p-6">
            <h1 className="text-2xl font-bold mb-2">プロフィール</h1>

            <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm">アイコン</label>

                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full border overflow-hidden bg-gray-100">
                            {avatarPreview ? (
                                <img
                                src={avatarPreview}
                                alt="avatar"
                                className="h-full w-full object-cover"
                            />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                    no image
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files?.[0] ?? null;

                                if (avatarPreview?.startsWith("blob:")) {
                                    URL.revokeObjectURL(avatarPreview);
                                }

                                setAvatarFile(f);
                                setAvatarPreview(f ? URL.createObjectURL(f) : avatarPreview);
                            }}
                            className="text-sm"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        画像を選んで「保存する」を押すと反映されます。
                    </p>
                </div>

                <div>
                    <label className="text-sm">表示名</label>
                    <input
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="プレイヤーネーム"
                    />
                </div>

                <div className="text-sm text-gray-600">
                    ロール: <span className="font-mono">{role || "-"}</span>
                </div>

                {message && (
                    <p className="whitespace-pre-wrap text-sm text-emerald-600">
                        {message}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md border bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
                    >
                        保存する
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm text-red-600 hover:underline"
                    >
                        ログアウト
                    </button>
                </div>
            </form>
        </div>
    )
}