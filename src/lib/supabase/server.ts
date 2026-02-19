import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Client Supabase pour Server Components et Route Handlers.
 * Lit et écrit les cookies via next/headers.
 */
export function createSupabaseServerClient() {
    const cookieStore = cookies();
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (_) {
                        // En Server Component, set() peut être ignoré
                    }
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch (_) {
                        // Idem
                    }
                },
            },
        }
    );
}
