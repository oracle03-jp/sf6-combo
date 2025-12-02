import { createClient } from "./server";

export async function getMyRole(): Promise<"admin"|"user"|null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    return (data?.role as "admin"|"user") ?? user
}