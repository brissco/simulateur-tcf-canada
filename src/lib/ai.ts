import type { AIFeedback } from "@/types/database";

/**
 * Wrapper pour l'API Gemini.
 * Construit un prompt structuré et parse la réponse JSON.
 */

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

function buildSystemPrompt(taskNumber: 1 | 2 | 3, content: string): string {
    const taskLabels = {
        1: "message informel (registre familier)",
        2: "message semi-formel (courriel professionnel)",
        3: "lettre formelle (institution officielle)",
    };

    return `Tu es un correcteur officiel du TCF Canada (Test de Connaissance du Français).
Tu dois évaluer le texte suivant qui correspond à la Tâche ${taskNumber} : ${taskLabels[taskNumber]}.

TEXTE À CORRIGER :
"""
${content}
"""

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans bloc de code) respectant exactement cette structure :
{
  "nclc_level": "NCLC X",
  "global_score": <0-100>,
  "grammar_errors": [
    { "original": "...", "correction": "...", "explanation": "..." }
  ],
  "suggestions": [
    { "original": "...", "improved": "...", "reason": "..." }
  ],
  "global_feedback": "...",
  "criteria": {
    "coherence": <0-10>,
    "lexique": <0-10>,
    "syntaxe": <0-10>
  }
}

CRITÈRES D'ÉVALUATION NCLC :
- NCLC 5-6 : Erreurs fréquentes, lexique limité, structure simple
- NCLC 7-8 : Quelques erreurs mineures, bon vocabulaire, structure variée
- NCLC 9-10 : Très peu d'erreurs, vocabulaire riche, style élaboré

Sois précis, bienveillant et pédagogique. Donne au minimum 2 suggestions d'amélioration.`;
}

export async function analyzeWithGemini(
    taskNumber: 1 | 2 | 3,
    content: string,
    apiKey: string
): Promise<AIFeedback> {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: buildSystemPrompt(taskNumber, content) }],
                },
            ],
            generationConfig: {
                temperature: 0.3,       // Faible pour des corrections précises
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Réponse IA vide ou invalide.");

    try {
        const parsed = JSON.parse(rawText) as AIFeedback;
        return parsed;
    } catch (_) {
        throw new Error("Impossible de parser la réponse JSON de l'IA.");
    }
}
