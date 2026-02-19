import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pour Server Components et Route Handlers.
 * Lit et écrit les cookies via next/headers (API async Next.js 15).
 * Note: on n'applique pas le generic Database ici car PostgREST v12
 * change l'inférence des types et génère des `never` sur insert/update.
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
                        );
                    } catch {
                        // En Server Component, set() peut être ignoré
                    }
                },
            },
        }
    );
}
