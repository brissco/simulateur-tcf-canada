import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

/**
 * Middleware Next.js :
 * - Rafraîchit le token Supabase automatiquement
 * - Protège les routes /exam et /community
 */
export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Rafraîchit la session (critique pour SSR)
    const { data: { user } } = await supabase.auth.getUser();

    // Routes protégées
    const protectedRoutes = ["/exam", "/community", "/dashboard"];
    const isProtected = protectedRoutes.some((r) =>
        request.nextUrl.pathname.startsWith(r)
    );

    if (isProtected && !user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Redirige vers /dashboard si déjà connecté et sur /login ou /register
    const authRoutes = ["/login", "/register"];
    const isAuthRoute = authRoutes.some((r) =>
        request.nextUrl.pathname.startsWith(r)
    );

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
