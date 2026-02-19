"use client";

import { useState, useEffect } from "react";
import { useExamStore } from "@/store/examStore";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { TaskEditor } from "@/components/exam/TaskEditor";
import { TASK_CONSTRAINTS } from "@/types/database";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CheckCircle, Send, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Page /exam — Mode Examen principal.
 * Gère le cycle de vie complet : démarrage → rédaction → soumission → résultats.
 */
export default function ExamPage() {
    const {
        phase, examId, activeTask, tasks, allTasksValid,
        startExam, setActiveTask, submitExam, resetExam,
    } = useExamStore();

    const [isStarting, setIsStarting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    // Créer une session d'examen en DB et démarrer le timer
    const handleStart = async () => {
        setIsStarting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }

            // Upsert du profil au cas où le trigger n'aurait pas tourné
            // (ex : compte créé avant l'application des migrations)
            const username =
                user.user_metadata?.username ??
                user.user_metadata?.full_name ??
                user.email?.split("@")[0] ??
                "utilisateur";

            await supabase
                .from("profiles")
                .upsert({ id: user.id, username }, { onConflict: "id", ignoreDuplicates: true });

            const { data: exam, error } = await supabase
                .from("exams")
                .insert({ user_id: user.id })
                .select("id")
                .single();

            if (error || !exam) throw new Error(error?.message ?? "Erreur création examen");

            startExam(exam.id);
        } catch (e) {
            console.error(e);
        } finally {
            setIsStarting(false);
        }
    };

    // Soumission manuelle
    const handleSubmit = async () => {
        if (!examId) return;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const taskArray = [1, 2, 3].map((n) => ({
                taskNumber: n as 1 | 2 | 3,
                content: tasks[n as 1 | 2 | 3].content,
                wordCount: tasks[n as 1 | 2 | 3].wordCount,
            }));

            const res = await fetch("/api/submit-exam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ examId, tasks: taskArray }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Erreur de soumission");
            }

            submitExam();
            router.push(`/results/${examId}`);
        } catch (e: unknown) {
            setSubmitError(e instanceof Error ? e.message : "Erreur inconnue");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Phase Idle ───────────────────────────────────────────────────────────
    if (phase === "idle") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-lg w-full card text-center animate-slide-up">
                    <h1 className="text-3xl font-bold text-white mb-3">Mode Examen TCF</h1>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Vous disposez de <strong className="text-brand-300">60 minutes</strong> pour rédiger
                        3 tâches d'expression écrite. Toute aide extérieure est désactivée.
                    </p>
                    <ul className="mb-8 text-left text-sm text-gray-400 space-y-2">
                        {["Copier-coller désactivé", "Correcteur orthographique désactivé", "Soumission automatique à l'expiration du temps"].map((r) => (
                            <li key={r} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-brand-400 shrink-0" />
                                {r}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleStart}
                        disabled={isStarting}
                        className="btn-primary w-full py-3 text-base justify-center"
                    >
                        {isStarting ? "Démarrage..." : "Démarrer l'examen"}
                    </button>
                </div>
            </div>
        );
    }

    // ─── Phase Running / Active ───────────────────────────────────────────────
    const constraints = TASK_CONSTRAINTS.find((c) => c.taskNumber === activeTask)!;
    const allValid = allTasksValid();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top bar */}
            <header className="sticky top-0 z-50 glass border-b border-surface-border">
                <div className="page-container flex h-16 items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-200">TCF Canada AI+</span>
                        {/* Onglets tâches */}
                        <div className="flex gap-1">
                            {([1, 2, 3] as const).map((n) => {
                                const wc = tasks[n].wordCount;
                                const c = TASK_CONSTRAINTS.find((x) => x.taskNumber === n)!;
                                const isValid = wc >= c.minWords && wc <= c.maxWords;
                                return (
                                    <button
                                        key={n}
                                        onClick={() => setActiveTask(n)}
                                        className={cn(
                                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                                            activeTask === n
                                                ? "bg-brand-600 text-white"
                                                : "bg-surface-card text-gray-400 hover:text-gray-200",
                                            isValid && activeTask !== n && "border border-emerald-500/50"
                                        )}
                                    >
                                        T{n}
                                        {isValid && <span className="ml-1 text-emerald-400">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ExamTimer />
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            title={!allValid ? "Toutes les tâches doivent respecter les contraintes" : undefined}
                            className={cn(
                                "btn-primary py-2 px-4 text-xs",
                                !allValid && "opacity-60"
                            )}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {isSubmitting ? "Soumission..." : "Soumettre"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Éditeur principal */}
            <main className="flex-1 page-container py-6">
                {submitError && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/30 p-3 text-sm text-red-300">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {submitError}
                    </div>
                )}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-100">{constraints.label}</h2>
                </div>
                <TaskEditor constraints={constraints} />
            </main>
        </div>
    );
}
