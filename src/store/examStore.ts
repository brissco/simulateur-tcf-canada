import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { EXAM_DURATION_SECONDS, type TaskConstraints, TASK_CONSTRAINTS } from "@/types/database";
import { countWords } from "@/lib/utils";

// ─── Types du Store ──────────────────────────────────────────────────────────

export interface TaskDraft {
    taskNumber: 1 | 2 | 3;
    content: string;
    wordCount: number;
}

export interface Subject {
    id: string;
    title: string;
    task1_prompt: string;
    task2_prompt: string;
    task3_prompt: string;
}

export type ExamPhase = "idle" | "running" | "submitted" | "results";

interface ExamState {
    // Identifiants
    examId: string | null;
    subject: Subject | null;

    // Phase courante
    phase: ExamPhase;

    // Timer
    secondsRemaining: number;
    timerStartedAt: number | null; // timestamp epoch

    // Tâches
    tasks: Record<1 | 2 | 3, TaskDraft>;

    // Tâche active dans le UI
    activeTask: 1 | 2 | 3;

    // Actions
    startExam: (examId: string, subject: Subject) => void;
    updateTaskContent: (taskNumber: 1 | 2 | 3, content: string) => void;
    setActiveTask: (taskNumber: 1 | 2 | 3) => void;
    tick: () => void;
    submitExam: () => void;
    resetExam: () => void;

    // Sélecteurs
    getTaskConstraints: (taskNumber: 1 | 2 | 3) => TaskConstraints;
    isTaskValid: (taskNumber: 1 | 2 | 3) => boolean;
    allTasksValid: () => boolean;
}

// ─── État initial ─────────────────────────────────────────────────────────────

const createInitialTasks = (): Record<1 | 2 | 3, TaskDraft> => ({
    1: { taskNumber: 1, content: "", wordCount: 0 },
    2: { taskNumber: 2, content: "", wordCount: 0 },
    3: { taskNumber: 3, content: "", wordCount: 0 },
});

// ─── Store Zustand ────────────────────────────────────────────────────────────

export const useExamStore = create<ExamState>()(
    devtools(
        persist(
            (set, get) => ({
                examId: null,
                subject: null,
                phase: "idle",
                secondsRemaining: EXAM_DURATION_SECONDS,
                timerStartedAt: null,
                tasks: createInitialTasks(),
                activeTask: 1,

                startExam: (examId, subject) => {
                    set({
                        examId,
                        subject,
                        phase: "running",
                        secondsRemaining: EXAM_DURATION_SECONDS,
                        timerStartedAt: Date.now(),
                        tasks: createInitialTasks(),
                        activeTask: 1,
                    });
                },

                updateTaskContent: (taskNumber, content) => {
                    const phase = get().phase;
                    if (phase !== "running") return; // anti-triche côté store

                    set((state) => ({
                        tasks: {
                            ...state.tasks,
                            [taskNumber]: {
                                ...state.tasks[taskNumber],
                                content,
                                wordCount: countWords(content),
                            },
                        },
                    }));
                },

                setActiveTask: (taskNumber) => {
                    set({ activeTask: taskNumber });
                },

                tick: () => {
                    const { secondsRemaining, phase } = get();
                    if (phase !== "running") return;

                    if (secondsRemaining <= 0) {
                        set({ phase: "submitted", secondsRemaining: 0 });
                        return;
                    }

                    set({ secondsRemaining: secondsRemaining - 1 });
                },

                submitExam: () => {
                    set({ phase: "submitted" });
                },

                resetExam: () => {
                    set({
                        examId: null,
                        subject: null,
                        phase: "idle",
                        secondsRemaining: EXAM_DURATION_SECONDS,
                        timerStartedAt: null,
                        tasks: createInitialTasks(),
                        activeTask: 1,
                    });
                },

                // ─── Sélecteurs ───────────────────────────────────────────────────

                getTaskConstraints: (taskNumber) => {
                    const { subject } = get();
                    const base = TASK_CONSTRAINTS.find((t) => t.taskNumber === taskNumber)!;

                    if (subject) {
                        const prompt = taskNumber === 1 ? subject.task1_prompt :
                            taskNumber === 2 ? subject.task2_prompt :
                                subject.task3_prompt;
                        return { ...base, prompt };
                    }

                    return base;
                },

                isTaskValid: (taskNumber) => {
                    const { tasks } = get();
                    const constraints = TASK_CONSTRAINTS.find((t) => t.taskNumber === taskNumber)!;
                    const wc = tasks[taskNumber].wordCount;
                    return wc >= constraints.minWords && wc <= constraints.maxWords;
                },

                allTasksValid: () => {
                    const { isTaskValid } = get();
                    return isTaskValid(1) && isTaskValid(2) && isTaskValid(3);
                },
            }),
            {
                name: "tcf-exam-store",
                // Ne persiste que les données essentielles
                partialize: (state) => ({
                    examId: state.examId,
                    subject: state.subject,
                    phase: state.phase,
                    secondsRemaining: state.secondsRemaining,
                    timerStartedAt: state.timerStartedAt,
                    tasks: state.tasks,
                    activeTask: state.activeTask,
                }),
            }
        ),
        { name: "TCF Exam Store" }
    )
);
