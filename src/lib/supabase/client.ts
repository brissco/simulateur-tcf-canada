import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour les Client Components.
 * Singleton pattern pour éviter de créer plusieurs instances.
 * Note: on n'applique pas le generic Database ici car PostgREST v12
 * change l'inférence des types et génère des `never` sur insert/update.
 */
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
    if (!client) {
        client = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return client;
}
