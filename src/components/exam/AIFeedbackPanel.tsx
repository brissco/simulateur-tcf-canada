"use client";

import type { AIFeedback } from "@/types/database";
import { cn, getNclcColor } from "@/lib/utils";
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

interface AIFeedbackPanelProps {
    feedback: AIFeedback;
    taskNumber: 1 | 2 | 3;
}

/**
 * AIFeedbackPanel — Affichage structuré du rapport IA :
 * - Score NCLC avec scorecard
 * - Erreurs grammaticales avec correction
 * - Suggestions d'amélioration
 * - Retour global
 */
export function AIFeedbackPanel({ feedback, taskNumber }: AIFeedbackPanelProps) {
    const nclcColor = getNclcColor(feedback.nclc_level);

    return (
        <div className="flex flex-col gap-4 animate-slide-up">
            {/* Header — Score global */}
            <div className="rounded-2xl border border-brand-700/50 bg-gradient-to-br from-brand-950 to-surface-card p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">
                            Analyse IA — Tâche {taskNumber}
                        </p>
                        <h3 className={cn("text-3xl font-bold font-mono", nclcColor)}>
                            {feedback.nclc_level}
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Score global</p>
                        <p className={cn("text-2xl font-bold font-mono", nclcColor)}>
                            {feedback.global_score}
                            <span className="text-sm text-gray-500">/100</span>
                        </p>
                    </div>
                </div>

                {/* Critères */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {Object.entries(feedback.criteria).map(([key, value]) => (
                        <div key={key} className="text-center">
                            <p className="text-xs text-gray-400 capitalize mb-1">{key}</p>
                            <div className="relative h-1.5 rounded-full bg-surface-border overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-brand-500 transition-all duration-700"
                                    style={{ width: `${(value / 10) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs font-mono font-semibold text-brand-300 mt-1">
                                {value}/10
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Retour global */}
            <div className="rounded-xl border border-surface-border bg-surface-card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-brand-400" />
                    <h4 className="text-sm font-semibold text-gray-200">Évaluation globale</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{feedback.global_feedback}</p>
            </div>

            {/* Erreurs grammaticales */}
            {feedback.grammar_errors.length > 0 && (
                <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <h4 className="text-sm font-semibold text-red-300">
                            Erreurs détectées ({feedback.grammar_errors.length})
                        </h4>
                    </div>
                    <div className="flex flex-col gap-3">
                        {feedback.grammar_errors.map((err, i) => (
                            <div key={i} className="rounded-lg bg-red-950/30 p-3 border border-red-900/30">
                                <div className="flex items-center gap-2 text-xs mb-1">
                                    <span className="line-through text-red-400 font-mono">{err.original}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className="text-emerald-400 font-mono font-semibold">{err.correction}</span>
                                </div>
                                <p className="text-xs text-gray-400">{err.explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {feedback.suggestions.length > 0 && (
                <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        <h4 className="text-sm font-semibold text-amber-300">
                            Suggestions d'amélioration
                        </h4>
                    </div>
                    <div className="flex flex-col gap-3">
                        {feedback.suggestions.map((s, i) => (
                            <div key={i} className="rounded-lg bg-amber-950/30 p-3 border border-amber-900/30">
                                <div className="flex flex-col gap-1 text-xs mb-1">
                                    <span className="text-gray-400 italic">"{s.original}"</span>
                                    <span className="text-amber-300 font-medium">↳ "{s.improved}"</span>
                                </div>
                                <p className="text-xs text-gray-500">{s.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mention si pas d'erreurs */}
            {feedback.grammar_errors.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-300">
                        Aucune erreur grammaticale majeure détectée. Excellent travail !
                    </p>
                </div>
            )}
        </div>
    );
}
