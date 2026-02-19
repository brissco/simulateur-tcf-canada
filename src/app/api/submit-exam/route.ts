import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/submit-exam
 * Sauvegarde les tâches, verrouille l'examen et déclenche l'analyse IA
 * via une Supabase Edge Function en arrière-plan.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createSupabaseServerClient();

        // Vérification de session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { examId, tasks } = body as {
            examId: string;
            tasks: Array<{
                taskNumber: 1 | 2 | 3;
                content: string;
                wordCount: number;
            }>;
        };

        // Vérification que l'examen appartient à l'utilisateur
        const { data: exam, error: examError } = await supabase
            .from("exams")
            .select("id, user_id, is_locked")
            .eq("id", examId)
            .eq("user_id", user.id)
            .single();

        if (examError || !exam) {
            return NextResponse.json({ error: "Examen introuvable" }, { status: 404 });
        }

        if (exam.is_locked) {
            return NextResponse.json({ error: "Examen déjà soumis" }, { status: 409 });
        }

        // 1. Insérer toutes les tâches
        const taskInserts = tasks.map((t) => ({
            exam_id: examId,
            task_number: t.taskNumber,
            content: t.content,
            word_count: t.wordCount,
        }));

        const { data: insertedTasks, error: tasksError } = await supabase
            .from("tasks")
            .insert(taskInserts)
            .select("id, task_number");

        if (tasksError) {
            throw new Error(`Erreur insertion tâches: ${tasksError.message}`);
        }

        // 2. Verrouiller l'examen
        await supabase
            .from("exams")
            .update({ is_locked: true, submitted_at: new Date().toISOString() })
            .eq("id", examId);

        // 3. Déclencher l'analyse IA en arrière-plan pour chaque tâche
        //    On ne bloque pas la réponse — le client vérifiera l'état via polling/realtime
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceKey && insertedTasks) {
            // Fire-and-forget : on ne attend pas la réponse IA
            for (const task of insertedTasks) {
                const originalTask = tasks.find((t) => t.taskNumber === task.task_number);
                if (originalTask) {
                    fetch(`${supabaseUrl}/functions/v1/analyze-task`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${serviceKey}`,
                        },
                        body: JSON.stringify({
                            taskId: task.id,
                            taskNumber: task.task_number,
                            content: originalTask.content,
                        }),
                    }).catch(console.error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            taskIds: insertedTasks?.map((t) => t.id) ?? [],
        });
    } catch (error) {
        console.error("[submit-exam]", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la soumission" },
            { status: 500 }
        );
    }
}
