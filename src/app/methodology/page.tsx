"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Info,
    FileText,
    Target,
    Clock,
    CheckCircle,
    Lightbulb,
    MessageSquare,
    Layout,
    UserCheck,
    ChevronRight,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MethodologyPage() {
    return (
        <main className="min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-surface-border">
                <div className="page-container flex h-16 items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-surface-card rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Méthodologie TCF Canada</h1>
                </div>
            </header>

            <div className="page-container py-10 max-w-4xl">
                {/* Intro Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-xl p-2.5 bg-brand-950/50 border border-brand-800/30">
                            <Info className="h-6 w-6 text-brand-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Introduction</h2>
                    </div>
                    <div className="card bg-surface-card border-surface-border p-6 leading-relaxed text-gray-300 space-y-4">
                        <p>
                            L'expression écrite du TCF Canada évalue votre capacité à produire un discours écrit clair et structuré en français.
                            L'épreuve dure <span className="text-brand-400 font-semibold font-mono">60 minutes</span> et se compose de <span className="text-brand-400 font-semibold font-mono">3 tâches</span>.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 mt-4">
                            <div className="rounded-lg bg-surface-dark p-4 border border-surface-border/50">
                                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-brand-400" /> Objectifs de l'épreuve
                                </h3>
                                <ul className="text-sm space-y-2">
                                    <li>• Communiquer un message clair</li>
                                    <li>• Décrire, raconter, expliquer</li>
                                    <li>• Justifier un choix ou une position</li>
                                    <li>• Enchaîner des idées avec cohérence</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-surface-dark p-4 border border-surface-border/50">
                                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-brand-400" /> Répartition
                                </h3>
                                <ul className="text-sm space-y-2">
                                    <li>• Tâche 1: 60 - 120 mots</li>
                                    <li>• Tâche 2: 120 - 150 mots</li>
                                    <li>• Tâche 3: 120 - 180 mots</li>
                                    <li className="text-gray-500 italic mt-1 text-[11px]">Durée totale : 1 heure conseillée</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Task 1 Section */}
                <section className="mb-12 scroll-mt-24" id="task1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-xl p-2.5 bg-blue-950/50 border border-blue-800/30">
                            <MessageSquare className="h-6 w-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-mono">Tâche 1</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="card bg-surface-card border-surface-border p-6">
                            <p className="text-gray-300 mb-6">
                                Rédaction d’un message pour décrire, raconter et/ou expliquer, adressé à un ou plusieurs destinataires précisés dans la consigne.
                            </p>

                            <div className="rounded-xl bg-blue-950/20 border border-blue-900/40 p-5">
                                <h3 className="text-blue-300 font-bold mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Layout className="h-4 w-4" /> Structure type du mail
                                </h3>
                                <ol className="space-y-3">
                                    {[
                                        { t: "Objet", d: "Ex: Mes congés à Marrakech" },
                                        { t: "Salutations", d: "Ex: Coucou Ayoub, comment tu vas ?" },
                                        { t: "Objectif général", d: "Ex: Je t’écris ce mail pour te dire que je serai à Paris." },
                                        { t: "Détails (Qui ? Quoi ? Quand ? Où ?)", d: "Expliquez les circonstances demandées." },
                                        { t: "Attentes concrètes", d: "Ex: J’aimerais que tu identifies des endroits chics." },
                                        { t: "Clôture", d: "Recommandation, promesse ou remerciement." },
                                        { t: "Formules d’Au revoir", d: "À bientôt, Amicalement, Cordialement, etc." }
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center text-[10px] font-bold border border-blue-800/50">
                                                {i + 1}
                                            </span>
                                            <div>
                                                <span className="text-white font-semibold">{step.t} :</span>{" "}
                                                <span className="text-gray-400">{step.d}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Task 2 Section */}
                <section className="mb-12 scroll-mt-24" id="task2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-xl p-2.5 bg-amber-950/50 border border-amber-800/30">
                            <FileText className="h-6 w-6 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-mono">Tâche 2</h2>
                    </div>
                    <div className="card bg-surface-card border-surface-border p-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText className="h-24 w-24" />
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Rédiger un article, un courrier ou une note pour rapporter des faits avec des commentaires, opinions ou arguments.
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                                    <Lightbulb className="h-4 w-4" /> Conseils Clés
                                </div>
                                <ul className="text-sm text-gray-400 space-y-3">
                                    <li className="flex gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span><strong>Concision</strong> : 120 à 150 mots maximum.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span><strong>Objectif</strong> : Attirer, plaire, convaincre ou revendiquer.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span><strong>Authenticité</strong> : Partagez une dimension personnelle.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-surface-dark border border-surface-border rounded-xl p-5">
                                <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
                                    Focus : L'article de blog
                                </h3>
                                <div className="space-y-2 text-[13px]">
                                    <p className="text-gray-400"><strong className="text-gray-200">1. Titre accrocheur :</strong> Le fer de lance de l'attrait.</p>
                                    <p className="text-gray-400"><strong className="text-gray-200">2. Introduction :</strong> Succincte et séduisante.</p>
                                    <p className="text-gray-400"><strong className="text-gray-200">3. Récit :</strong> Expérience détaillée.</p>
                                    <p className="text-gray-400"><strong className="text-gray-200">4. Conclusion :</strong> Recommandations pour le lecteur.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Task 3 Section */}
                <section className="mb-12 scroll-mt-24" id="task3">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-xl p-2.5 bg-emerald-950/50 border border-emerald-800/30">
                            <Users className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-mono">Tâche 3</h2>
                    </div>
                    <div className="card bg-surface-card border-surface-border p-6">
                        <p className="text-gray-300 mb-6">
                            Rédaction d’un texte pour comparer des opinions à partir de deux documents. <strong>120 à 180 mots.</strong>
                        </p>

                        <div className="space-y-6">
                            {/* Part 1: Synthesis */}
                            <div className="relative pl-8 border-l-2 border-emerald-800/40">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-emerald-400">1</span>
                                </div>
                                <h3 className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wide">Première Partie : Synthèse (40-60 mots)</h3>
                                <p className="text-sm text-gray-400 mb-3">Synthétisez les points de vue des deux documents avec objectivité.</p>
                                <div className="bg-surface-dark p-4 rounded-lg font-mono text-xs text-emerald-300/80 italic border border-emerald-900/30">
                                    "La question de [Sujet] attire diverses opinions. D’un côté, certains soutiennent que [Résumé Doc A]. D’un autre côté, d'autres considèrent que [Résumé Doc B]."
                                </div>
                            </div>

                            {/* Part 2: Opinion */}
                            <div className="relative pl-8 border-l-2 border-emerald-800/40">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-emerald-400">2</span>
                                </div>
                                <h3 className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wide">Seconde Partie : Votre Opinion (80-120 mots)</h3>
                                <p className="text-sm text-gray-400 mb-3">Exprimez votre avis personnel de manière argumentée.</p>
                                <div className="bg-surface-dark p-4 rounded-lg font-mono text-xs text-emerald-300/80 italic border border-emerald-900/30">
                                    "Devant cette situation, on ne peut nier que [Thèse]. Cependant, il est impératif de [Argument/Solution] afin de [Objectif]."
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Strategy Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-xl p-2.5 bg-brand-950/50 border border-brand-800/30">
                            <UserCheck className="h-6 w-6 text-brand-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Conseils pour réussir</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="card bg-surface-card border-surface-border p-5">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">Le vouvoiement</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Utilisez <strong className="text-gray-200">"Tu"</strong> pour un ami ou un collègue proche.<br />
                                Utilisez <strong className="text-gray-200">"Vous"</strong> pour un supérieur, un inconnu ou un commerçant. Identifiez bien le statut dans la consigne !
                            </p>
                        </div>
                        <div className="card bg-surface-card border-surface-border p-5">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">Lexique & Tonalité</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Chaque tâche a un lexique particulier : décrivez pour la T1, expliquez pour la T2, et argumentez/comparez pour la T3.
                            </p>
                        </div>
                        <div className="card bg-surface-card border-surface-border p-5 sm:col-span-2">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">Points critiques</h3>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="flex items-start gap-2 text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <span>Respectez strictement le nombre de mots.</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <span>Gestion du temps : 1 heure pour 3 tâches.</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                    <span>Identification claire de l'objectif de rédaction.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="text-center bg-brand-950/20 border border-brand-900/30 rounded-3xl p-10">
                    <h2 className="text-2xl font-bold text-white mb-4">Prêt à mettre cela en pratique ?</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        La meilleure façon de réussir est de s'exercer régulièrement avec nos simulateurs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/exam" className="btn-primary py-3 px-8 justify-center">
                            Démarrer un examen
                        </Link>
                        <Link href="/exam?mode=practice" className="btn-secondary py-3 px-8 justify-center">
                            Mode pratique IA
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
