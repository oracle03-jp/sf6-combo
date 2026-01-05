"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Mode = "signin" | "signup"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!signInError) {
                router.push("/")
                router.refresh();
                return;
            }

            if (!username.trim()) {
                setError("新規登録の場合はユーザー名を入力してください")
                setLoading(false);
                return;
            }

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: username.trim(),
                    },
                },
            });

            if (signUpError) throw signUpError;

            router.push("/")
            router.refresh();
        } catch (err: any) {
            setError(err.message ?? "エラーが発生しました")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border px-8 py-6 shadow-sm bg-white">
                <h1 className="mb-4 text-center text-2xl font-bold">
                    ログイン / サインアップ
                </h1>

                <p className="mb-6 text-center text-sm text-gray-600">
                    すでにアカウントがあればログイン、なければそのまま新規登録されます。
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm">メールアドレス</label>
                        <input
                            type="email"
                            required
                            className="mt-1 w-full rounded-md border px-3 py-2 placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm">パスワード</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="mt-1 w-full rounded-md border px-3 py-2 placeholder-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6文字以上"
                        />
                    </div>

                    <div>
                        <label className="text-sm">ユーザー名（新規登録の場合）</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border px-3 py-2 placeholder-gray-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="例: GoukiMaster"
                        />
                    </div>

                    {error && (
                        <p className="whitespace-pre-wrap text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-md border bg-black py-2 text-white disabled:opacity-60"
                    >
                        {loading ? "処理中..." : "ログイン / サインアップ"}
                    </button>
                </form>
            </div>
        </div>
    )
}