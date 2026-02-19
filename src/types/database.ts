/**
 * Types TypeScript dérivés du schéma PostgreSQL Supabase.
 * Ces types servent d'interface entre la DB et l'application.
 * Format compatible Supabase JS v2 + PostgREST v12.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    nclc_target: number;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    nclc_target?: number;
                    created_at?: string;
                };
                Update: {
                    username?: string;
                    nclc_target?: number;
                };
                Relationships: [];
            };
            exams: {
                Row: {
                    id: string;
                    user_id: string;
                    subject_id: string | null;
                    started_at: string;
                    submitted_at: string | null;
                    is_locked: boolean;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    subject_id?: string | null;
                    started_at?: string;
                    submitted_at?: string | null;
                    is_locked?: boolean;
                };
                Update: {
                    subject_id?: string | null;
                    submitted_at?: string | null;
                    is_locked?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: "exams_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "exams_subject_id_fkey";
                        columns: ["subject_id"];
                        isOneToOne: false;
                        referencedRelation: "subjects";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tasks: {
                Row: {
                    id: string;
                    exam_id: string;
                    task_number: number;
                    content: string;
                    word_count: number;
                    ai_score: string | null;
                    ai_feedback: Json | null;
                    ai_analyzed_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    exam_id: string;
                    task_number: number;
                    content: string;
                    word_count: number;
                    ai_score?: string | null;
                    ai_feedback?: Json | null;
                    ai_analyzed_at?: string | null;
                };
                Update: {
                    content?: string;
                    word_count?: number;
                    ai_score?: string | null;
                    ai_feedback?: Json | null;
                    ai_analyzed_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tasks_exam_id_fkey";
                        columns: ["exam_id"];
                        isOneToOne: false;
                        referencedRelation: "exams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            feedbacks: {
                Row: {
                    id: string;
                    task_id: string;
                    author_id: string;
                    comment: string;
                    rating: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    task_id: string;
                    author_id: string;
                    comment: string;
                    rating: number;
                };
                Update: {
                    comment?: string;
                    rating?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "feedbacks_task_id_fkey";
                        columns: ["task_id"];
                        isOneToOne: false;
                        referencedRelation: "tasks";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "feedbacks_author_id_fkey";
                        columns: ["author_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subjects: {
                Row: {
                    id: string;
                    title: string;
                    task1_prompt: string;
                    task2_prompt: string;
                    task3_prompt: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    task1_prompt: string;
                    task2_prompt: string;
                    task3_prompt: string;
                    created_at?: string;
                };
                Update: {
                    title?: string;
                    task1_prompt?: string;
                    task2_prompt?: string;
                    task3_prompt?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

// ─── Domaine IA ─────────────────────────────────────────────────────────────

export interface GrammarError {
    original: string;
    correction: string;
    explanation: string;
    position?: number;
}

export interface Suggestion {
    original: string;
    improved: string;
    reason: string;
}

export interface AIFeedback {
    nclc_level: string;          // ex: "NCLC 7"
    global_score: number;        // 0-100
    grammar_errors: GrammarError[];
    suggestions: Suggestion[];
    global_feedback: string;
    criteria: {
        coherence: number;         // 0-10
        lexique: number;           // 0-10
        syntaxe: number;           // 0-10
    };
}

// ─── Domaine Examen ─────────────────────────────────────────────────────────

export interface TaskConstraints {
    taskNumber: 1 | 2 | 3;
    minWords: number;
    maxWords: number;
    label: string;
    prompt: string;
}

export const TASK_CONSTRAINTS: TaskConstraints[] = [
    {
        taskNumber: 1,
        minWords: 60,
        maxWords: 120,
        label: "Tâche 1 — Message informel",
        prompt:
            "Vous devez écrire un message informel à un ami pour lui décrire votre expérience récente au Canada. Utilisez un registre familier mais correct.",
    },
    {
        taskNumber: 2,
        minWords: 120,
        maxWords: 150,
        label: "Tâche 2 — Message semi-formel",
        prompt:
            "Vous devez écrire un courriel à votre employeur pour demander un congé. Utilisez un registre semi-formel.",
    },
    {
        taskNumber: 3,
        minWords: 120,
        maxWords: 180,
        label: "Tâche 3 — Message formel",
        prompt:
            "Vous devez rédiger une lettre formelle à une institution (banque, mairie, école) pour faire une réclamation ou une demande officielle.",
    },
];

export const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes
