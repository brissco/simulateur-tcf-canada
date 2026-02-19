import Link from "next/link";
import { BookOpen, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Mode Examen Réel",
        description: "60 minutes, 3 tâches, compteur de mots, conditions authentiques sans correcteur orthographique.",
        color: "text-brand-400",
        bg: "bg-brand-950/50",
        border: "border-brand-800/40",
    },
    {
        icon: Zap,
        title: "Correction IA Instantanée",
        description: "Analyse Gemini en temps réel : score NCLC, erreurs grammaticales, suggestions d'amélioration.",
        color: "text-amber-400",
        bg: "bg-amber-950/30",
        border: "border-amber-800/40",
    },
    {
        icon: Users,
        title: "Entraide Communauté",
        description: "Publiez votre texte, recevez des corrections humaines en temps réel de la communauté.",
        color: "text-emerald-400",
        bg: "bg-emerald-950/30",
        border: "border-emerald-800/40",
    },
];

const nclcLevels = [
    { level: "NCLC 5-6", label: "Débutant avancé", color: "text-amber-400" },
    { level: "NCLC 7-8", label: "Intermédiaire supérieur", color: "text-brand-400" },
    { level: "NCLC 9-10", label: "Avancé", color: "text-emerald-400" },
];

export default function HomePage() {
    return (
        <main className="relative overflow-hidden">
            {/* Hero glow background */}
            <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 glass border-b border-surface-border">
                <div className="page-container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-brand-400">TCF</span>
                        <span className="text-xl font-bold text-white">Canada</span>
                        <span className="badge badge-brand ml-1">AI+</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="btn-secondary py-2 px-4 text-xs">
                            Connexion
                        </Link>
                        <Link href="/register" className="btn-primary py-2 px-4 text-xs">
                            Commencer
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero section */}
            <section className="page-container py-24 text-center">
                <div className="animate-fade-in">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-700/50 bg-brand-950/50 px-4 py-2 text-xs text-brand-300">
                        <Zap className="h-3 w-3" />
                        Propulsé par Gemini AI
                    </div>
                    <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
                        Préparez votre{" "}
                        <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                            TCF Canada
                        </span>{" "}
                        avec l'IA
                    </h1>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-gray-400 leading-relaxed">
                        Simulez l'épreuve d'expression écrite, obtenez un score NCLC instantané
                        et améliorez-vous grâce à la communauté.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/register" className="btn-primary px-8 py-3 text-base animate-pulse-glow">
                            Commencer gratuitement
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/community" className="btn-secondary px-8 py-3 text-base">
                            Voir la communauté
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="page-container py-16">
                <h2 className="section-title text-center mb-12">
                    Tout ce qu'il vous faut pour réussir
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.title} className={`card border ${f.border} ${f.bg} hover:scale-[1.02] transition-transform duration-200`}>
                            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${f.bg}`}>
                                <f.icon className={`h-6 w-6 ${f.color}`} />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* NCLC Levels */}
            <section className="page-container py-16">
                <div className="rounded-2xl border border-surface-border bg-surface-card p-8">
                    <h2 className="section-title mb-2 text-center">Niveaux NCLC évalués</h2>
                    <p className="text-center text-sm text-gray-500 mb-8">
                        L'IA évalue votre texte selon la grille officielle du TCF Canada
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {nclcLevels.map((l) => (
                            <div key={l.level} className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface/50 p-4">
                                <CheckCircle className={`h-5 w-5 shrink-0 ${l.color}`} />
                                <div>
                                    <p className={`font-bold font-mono ${l.color}`}>{l.level}</p>
                                    <p className="text-xs text-gray-500">{l.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-surface-border py-8 text-center">
                <p className="text-xs text-gray-600">
                    © 2026 TCF Canada AI+ — Projet Maisonier / Brice — Bâti avec Next.js + Supabase + Gemini
                </p>
            </footer>
        </main>
    );
}
