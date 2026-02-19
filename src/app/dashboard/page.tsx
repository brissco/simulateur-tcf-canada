import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Users, Zap, LogOut, ArrowRight, Clock, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Tableau de bord — TCF Canada AI+" };

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Utilisateur";

    return (
        <main className="min-h-screen">
            {/* Top navigation */}
            <nav className="sticky top-0 z-50 glass border-b border-surface-border">
                <div className="page-container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-brand-400">TCF</span>
                        <span className="text-xl font-bold text-white">Canada</span>
                        <span className="badge badge-brand ml-1">AI+</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 hidden sm:block">
                            👋 {displayName}
                        </span>
                        <form action="/api/auth/signout" method="post">
                            <button
                                type="submit"
                                className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Déconnexion
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="page-container py-12">
                {/* Welcome header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Bonjour,{" "}
                        <span className="text-brand-400">{displayName}</span> 👋
                    </h1>
                    <p className="text-gray-400">
                        Prêt à vous entraîner pour votre TCF Canada ? Choisissez une activité.
                    </p>
                </div>

                {/* Quick actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {/* Exam card */}
                    <Link
                        href="/exam"
                        className="group card border border-brand-800/40 bg-brand-950/50 hover:border-brand-600/60 hover:bg-brand-950/70 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="mb-4 inline-flex rounded-xl p-2.5 bg-brand-950/50">
                            <BookOpen className="h-7 w-7 text-brand-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                            Passer un examen
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            60 minutes, 3 tâches d'expression écrite dans des conditions authentiques.
                        </p>
                        <span className="flex items-center gap-1 text-xs text-brand-400 font-medium">
                            Démarrer <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    {/* AI correction card */}
                    <Link
                        href="/exam?mode=practice"
                        className="group card border border-amber-800/40 bg-amber-950/30 hover:border-amber-600/60 hover:bg-amber-950/50 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="mb-4 inline-flex rounded-xl p-2.5 bg-amber-950/30">
                            <Zap className="h-7 w-7 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                            Mode pratique IA
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Entraînez-vous sans minuteur et obtenez une correction Gemini instantanée.
                        </p>
                        <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                            Pratiquer <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    {/* Methodology card */}
                    <Link
                        href="/methodology"
                        className="group card border border-blue-800/40 bg-blue-950/30 hover:border-blue-600/60 hover:bg-blue-950/50 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="mb-4 inline-flex rounded-xl p-2.5 bg-blue-950/30">
                            <FileText className="h-7 w-7 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            Méthodologie
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Apprenez les règles et astuces pour réussir les 3 tâches de l'examen.
                        </p>
                        <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                            Consulter <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    {/* Community card */}
                    <Link
                        href="/community"
                        className="group card border border-emerald-800/40 bg-emerald-950/30 hover:border-emerald-600/60 hover:bg-emerald-950/50 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="mb-4 inline-flex rounded-xl p-2.5 bg-emerald-950/30">
                            <Users className="h-7 w-7 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                            Communauté
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Partagez vos textes et recevez des corrections humaines en temps réel.
                        </p>
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            Explorer <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>

                {/* Stats / info section */}
                <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-brand-400" />
                        <h2 className="font-semibold text-white">Informations TCF Canada</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3 text-sm text-gray-400">
                        <div className="flex flex-col gap-1">
                            <span className="text-white font-medium">Durée de l'épreuve</span>
                            <span>60 minutes au total</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-white font-medium">Nombre de tâches</span>
                            <span>3 tâches d'expression écrite</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-white font-medium">Niveaux évalués</span>
                            <span>NCLC 5 à NCLC 10</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
