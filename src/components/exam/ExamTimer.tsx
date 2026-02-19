"use client";

import { useEffect, useRef } from "react";
import { useExamStore } from "@/store/examStore";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";

/**
 * ExamTimer — Barre de progression avec compte à rebours.
 * Lance le setInterval et appelle tick() chaque seconde.
 * Verrouille automatiquement l'examen quand le temps expire.
 */
export function ExamTimer() {
    const { secondsRemaining, phase, tick, submitExam } = useExamStore();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (phase !== "running") return;

        intervalRef.current = setInterval(() => {
            tick();
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [phase, tick]);

    // Auto-submit quand le temps expire
    useEffect(() => {
        if (phase === "running" && secondsRemaining <= 0) {
            submitExam();
        }
    }, [secondsRemaining, phase, submitExam]);

    const totalSeconds = 60 * 60;
    const progressPct = (secondsRemaining / totalSeconds) * 100;

    const isWarning = secondsRemaining <= 10 * 60; // < 10 min
    const isDanger = secondsRemaining <= 5 * 60;  // < 5 min

    const timerColor = isDanger
        ? "text-red-400"
        : isWarning
            ? "text-amber-400"
            : "text-brand-300";

    const barColor = isDanger
        ? "bg-red-500"
        : isWarning
            ? "bg-amber-500"
            : "bg-brand-500";

    return (
        <div className="flex flex-col gap-2">
            {/* Timer display */}
            <div className={cn("flex items-center gap-2 font-mono text-2xl font-bold", timerColor)}>
                {isDanger ? (
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                ) : (
                    <Clock className="h-5 w-5" />
                )}
                <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-48 rounded-full bg-surface-border overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000", barColor)}
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            {isWarning && !isDanger && (
                <p className="text-xs text-amber-400/80">Moins de 10 minutes !</p>
            )}
            {isDanger && (
                <p className="text-xs text-red-400 animate-pulse font-semibold">
                    Terminez rapidement !
                </p>
            )}
        </div>
    );
}
