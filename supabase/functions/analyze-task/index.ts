// Supabase Edge Function (Deno runtime)
// Déploiement : supabase functions deploy analyze-task

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeTaskPayload {
    taskId: string;
    taskNumber: 1 | 2 | 3;
    content: string;
}

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

function buildPrompt(taskNumber: 1 | 2 | 3, content: string): string {
    const taskLabels: Record<number, string> = {
        1: "message informel",
        2: "message semi-formel",
        3: "lettre formelle",
    };

    return `Tu es un correcteur officiel du TCF Canada.
Évalue ce texte de Tâche ${taskNumber} (${taskLabels[taskNumber]}) :

"""
${content}
"""

Réponds UNIQUEMENT avec un JSON valide :
{
  "nclc_level": "NCLC X",
  "global_score": <0-100>,
  "grammar_errors": [{"original":"...","correction":"...","explanation":"..."}],
  "suggestions": [{"original":"...","improved":"...","reason":"..."}],
  "global_feedback": "...",
  "criteria": {"coherence":<0-10>,"lexique":<0-10>,"syntaxe":<0-10>}
}`;
}

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { taskId, taskNumber, content }: AnalyzeTaskPayload = await req.json();

        if (!taskId || !taskNumber || !content) {
            return new Response(
                JSON.stringify({ error: "Paramètres manquants" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const geminiKey = Deno.env.get("GEMINI_API_KEY");
        if (!geminiKey) throw new Error("GEMINI_API_KEY non configurée");

        // Appel Gemini
        const aiResponse = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(taskNumber, content) }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json",
                },
            }),
        });

        if (!aiResponse.ok) {
            throw new Error(`Gemini error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        const feedback = JSON.parse(rawText);

        // Mise à jour Supabase
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { error: updateError } = await supabase
            .from("tasks")
            .update({
                ai_score: feedback.nclc_level,
                ai_feedback: feedback,
                ai_analyzed_at: new Date().toISOString(),
            })
            .eq("id", taskId);

        if (updateError) throw new Error(`Supabase update error: ${updateError.message}`);

        return new Response(
            JSON.stringify({ success: true, nclc: feedback.nclc_level }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[analyze-task]", err);
        return new Response(
            JSON.stringify({ error: String(err) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
