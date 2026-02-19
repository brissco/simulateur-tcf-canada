"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AIFeedbackPanel } from "@/components/exam/AIFeedbackPanel";
import type { AIFeedback } from "@/types/database";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Star, User, Loader2 } from "lucide-react";
import { truncate } from "@/lib/utils";

interface TaskWithFeedbacks {
    id: string;
    task_number: 1 | 2 | 3;
    content: string;
    word_count: number;
    ai_score: string | null;
    ai_feedback: AIFeedback | null;
    created_at: string;
    profiles: { username: string } | null;
    feedbacks: Array<{
        id: string;
        comment: string;
        rating: number;
        created_at: string;
        profiles: { username: string } | null;
    }>;
}

/**
 * Page /community/[taskId] — Correction individuelle avec peer-review.
 * Utilise Supabase Realtime pour afficher les feedbacks en temps réel.
 */
export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
    const [task, setTask] = useState<TaskWithFeedbacks | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const supabase = createSupabaseBrowserClient();

    // Charger la tâche + feedbacks
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from("tasks")
                .select(`
          id, task_number, content, word_count, ai_score, ai_feedback, created_at,
          profiles(username),
          feedbacks(id, comment, rating, created_at, profiles(username))
        `)
                .eq("id", params.taskId)
                .single();

            if (data) setTask(data as unknown as TaskWithFeedbacks);
            setLoading(false);
        };
        load();

        // Realtime : écoute les nouveaux feedbacks
        const channel = supabase
            .channel(`task-feedbacks-${params.taskId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "feedbacks", filter: `task_id=eq.${params.taskId}` },
                (payload) => {
                    setTask((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            feedbacks: [...prev.feedbacks, payload.new as TaskWithFeedbacks["feedbacks"][0]],
                        };
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [params.taskId, supabase]);

    const handleSubmitFeedback = async () => {
        if (!comment.trim() || rating === 0) return;
        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("feedbacks") as any).insert({
            task_id: params.taskId,
            author_id: user.id,
            comment: comment.trim(),
            rating,
        });

        setComment("");
        setRating(0);
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Tâche introuvable.
            </div>
        );
    }

    return (
        <div className="page-container py-8">
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Colonne gauche : texte + IA */}
                <div className="flex flex-col gap-4">
                    {/* Infos */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-200">
                                {task.profiles?.username ?? "Anonyme"}
                            </span>
                            <span className="text-xs text-gray-500">·</span>
                            <span className="text-xs text-gray-500">{formatRelativeTime(task.created_at)}</span>
                            <span className="badge badge-brand ml-auto">Tâche {task.task_number}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {task.content}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">{task.word_count} mots</p>
                    </div>

                    {/* Panel IA */}
                    {task.ai_feedback ? (
                        <AIFeedbackPanel feedback={task.ai_feedback} taskNumber={task.task_number} />
                    ) : (
                        <div className="card flex items-center gap-3 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                            <span className="text-sm">Analyse IA en cours...</span>
                        </div>
                    )}
                </div>

                {/* Colonne droite : feedbacks humains */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-brand-400" />
                        Corrections de la communauté
                        <span className="badge badge-brand">{task.feedbacks.length}</span>
                    </h2>

                    {/* Formulaire feedback */}
                    <div className="card">
                        <h3 className="text-sm font-semibold text-gray-200 mb-3">Ajouter votre correction</h3>

                        {/* Note étoiles */}
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onMouseEnter={() => setHoveredStar(s)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    onClick={() => setRating(s)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className="h-5 w-5"
                                        fill={(hoveredStar || rating) >= s ? "#f59e0b" : "transparent"}
                                        stroke={(hoveredStar || rating) >= s ? "#f59e0b" : "#4b5563"}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-xs text-gray-500 self-center">
                                {rating > 0 ? `${rating}/5` : "Donnez une note"}
                            </span>
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Vos remarques, corrections et conseils..."
                            className="input min-h-[100px] resize-none mb-3"
                        />
                        <button
                            onClick={handleSubmitFeedback}
                            disabled={!comment.trim() || rating === 0 || submitting}
                            className="btn-primary w-full justify-center"
                        >
                            {submitting ? "Envoi..." : "Publier la correction"}
                        </button>
                    </div>

                    {/* Liste des feedbacks */}
                    <div className="flex flex-col gap-3">
                        {task.feedbacks.length === 0 ? (
                            <p className="text-center text-sm text-gray-600 py-8">
                                Soyez le premier à corriger ce texte !
                            </p>
                        ) : (
                            task.feedbacks.map((fb) => (
                                <div key={fb.id} className="card animate-fade-in">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-semibold text-gray-200">
                                            {fb.profiles?.username ?? "Utilisateur"}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-3.5 w-3.5"
                                                    fill={i < fb.rating ? "#f59e0b" : "transparent"}
                                                    stroke={i < fb.rating ? "#f59e0b" : "#4b5563"}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-auto text-xs text-gray-500">
                                            {formatRelativeTime(fb.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{fb.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
