import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time issues
let supabaseAdminInstance: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdminInstance) {
        supabaseAdminInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )
    }
    return supabaseAdminInstance
}

// For backward compatibility - but prefer getSupabaseAdmin()
export const supabaseAdmin = {
    from: (table: string) => getSupabaseAdmin().from(table),
    rpc: (fn: string, params?: Record<string, unknown>) => getSupabaseAdmin().rpc(fn, params),
}
