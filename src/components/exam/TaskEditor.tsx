"use client";

import { useCallback } from "react";
import { useExamStore } from "@/store/examStore";
import { cn, countWords, getWordCountStatus } from "@/lib/utils";
import type { TaskConstraints } from "@/types/database";

interface TaskEditorProps {
    constraints: TaskConstraints;
}

/**
 * TaskEditor — Éditeur sécurisé avec :
 * - Blocage copier-coller (anti-triche)
 * - Désactivation correcteur orthographique natif
 * - Compteur de mots en temps réel avec indicateur de conformité
 */
export function TaskEditor({ constraints }: TaskEditorProps) {
    const { tasks, phase, updateTaskContent } = useExamStore();
    const task = tasks[constraints.taskNumber];
    const isLocked = phase !== "running";

    const status = getWordCountStatus(
        task.wordCount,
        constraints.minWords,
        constraints.maxWords
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            updateTaskContent(constraints.taskNumber, e.target.value);
        },
        [constraints.taskNumber, updateTaskContent]
    );

    // ─── Anti-triche : bloquer copier-coller ──────────────────────────────────
    const blockPaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
    }, []);

    const blockCopy = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
    }, []);

    const blockCut = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
    }, []);

    // ─── Couleurs du compteur de mots ─────────────────────────────────────────
    const counterColor = {
        below: "text-amber-400",
        valid: "text-emerald-400",
        above: "text-red-400",
    }[status];

    const borderColor = {
        below: "border-surface-border focus:border-brand-500",
        valid: "border-emerald-500/60 focus:border-emerald-400",
        above: "border-red-500/60 focus:border-red-400",
    }[status];

    return (
        <div className="flex flex-col gap-3 animate-fade-in">
            {/* Prompt de la tâche */}
            <div className="rounded-xl border border-surface-border bg-surface-card/50 p-4">
                <p className="text-sm text-gray-300 leading-relaxed">{constraints.prompt}</p>
            </div>

            {/* Zone de texte */}
            <div className="relative">
                <textarea
                    value={task.content}
                    onChange={handleChange}
                    onPaste={blockPaste}
                    onCopy={blockCopy}
                    onCut={blockCut}
                    disabled={isLocked}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    data-gramm="false"          /* Désactive Grammarly */
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    placeholder={
                        isLocked
                            ? "Temps écoulé — Rédaction verrouillée."
                            : "Rédigez votre réponse ici..."
                    }
                    className={cn(
                        "w-full min-h-[240px] resize-none rounded-xl border-2 bg-surface-card",
                        "p-4 text-gray-100 text-sm leading-relaxed font-sans",
                        "placeholder:text-gray-600 outline-none transition-colors duration-200",
                        "scrollbar-thin scrollbar-track-surface scrollbar-thumb-surface-border",
                        borderColor,
                        isLocked && "opacity-60 cursor-not-allowed"
                    )}
                    aria-label={`Zone de rédaction ${constraints.label}`}
                />

                {/* Badge "Verrouillé" */}
                {isLocked && (
                    <div className="absolute top-3 right-3 rounded-md bg-red-900/60 px-2 py-1 text-xs font-semibold text-red-300 border border-red-500/40">
                        🔒 Verrouillé
                    </div>
                )}
            </div>

            {/* Compteur + contraintes */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                    Contrainte : {constraints.minWords}–{constraints.maxWords} mots
                </span>
                <div className="flex items-center gap-2">
                    {status === "below" && (
                        <span className="text-amber-400/80">
                            Encore {constraints.minWords - task.wordCount} mot(s) requis
                        </span>
                    )}
                    {status === "above" && (
                        <span className="text-red-400/80">
                            {task.wordCount - constraints.maxWords} mot(s) en trop
                        </span>
                    )}
                    <span className={cn("font-mono font-bold text-sm", counterColor)}>
                        {task.wordCount} mots
                    </span>
                    {/* Indicateur visuel */}
                    <span
                        className={cn(
                            "h-2 w-2 rounded-full",
                            status === "valid" ? "bg-emerald-400" : status === "below" ? "bg-amber-400" : "bg-red-400"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
