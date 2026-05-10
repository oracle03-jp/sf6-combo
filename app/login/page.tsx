"use client"

import { useTransition, FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { create } from "domain"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
            })

            if (signInError) {
                throw signInError
            }

            router.push("/")
            router.refresh()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("ログインに失敗しました")
            }
        } finally { 
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[80vh" items-center justify-center>
            <div className="w-full max-w-md rounded-2xl border bg-white px-8 py-6 shadow-sm">
                <h1 className="mb-4 text-center text-2xl font-bold">
                    ログイン
                </h1>

                <p className="mb-6 text-center text-sm text-gray-600">
                    登録済みのメールアドレスとパスワードでログインしてください
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm">メースアドレス</label>
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

                    {error && (
                        <p className="whitespace-pre-wrap text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-md border bg-black py-2 text-white disabled:opacity-60"
                    >
                        {loading ? "ログイン中..." : "ログイン"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    アカウントをお持ちでない方は{" "}
                    <Link href="/signup" className="font-medium text-blue-600 underline">
                        サインアップ
                    </Link>
                </p>
            </div>
        </div>
    )
}