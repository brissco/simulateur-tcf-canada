"use client";

import { useState } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface DocumentInput {
    id?: string;
    titre_document: string;
    contenu: string;
}

interface TacheInput {
    id?: string;
    numero_tache: 1 | 2 | 3;
    titre_tache: string;
    consigne: string;
    sujet_tache: string;
    type_tache: "simple" | "documentaire";
    documents: DocumentInput[];
}

interface CombinationEditorProps {
    onSuccess?: () => void;
    initialData?: {
        id: string;
        titre_combinaison: string;
        taches: TacheInput[];
    };
}

export function CombinationEditor({ onSuccess, initialData }: CombinationEditorProps) {
    const supabase = createSupabaseBrowserClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedTache, setExpandedTache] = useState<number | null>(1);

    const [titreCombinaison, setTitreCombinaison] = useState(initialData?.titre_combinaison || "");
    const [taches, setTaches] = useState<TacheInput[]>(
        initialData?.taches || [
            { numero_tache: 1, titre_tache: "", consigne: "", sujet_tache: "", type_tache: "simple", documents: [] },
            { numero_tache: 2, titre_tache: "", consigne: "", sujet_tache: "", type_tache: "simple", documents: [] },
            { numero_tache: 3, titre_tache: "", consigne: "", sujet_tache: "", type_tache: "documentaire", documents: [] },
        ]
    );

    const handleTacheChange = (index: number, field: keyof TacheInput, value: any) => {
        const newTaches = [...taches];
        newTaches[index] = { ...newTaches[index], [field]: value };
        setTaches(newTaches);
    };

    const handleDocumentChange = (tacheIndex: number, docIndex: number, field: keyof DocumentInput, value: string) => {
        const newTaches = [...taches];
        const newDocs = [...newTaches[tacheIndex].documents];
        newDocs[docIndex] = { ...newDocs[docIndex], [field]: value };
        newTaches[tacheIndex].documents = newDocs;
        setTaches(newTaches);
    };

    const addDocument = (tacheIndex: number) => {
        const newTaches = [...taches];
        newTaches[tacheIndex].documents.push({ titre_document: "", contenu: "" });
        setTaches(newTaches);
    };

    const removeDocument = (tacheIndex: number, docIndex: number) => {
        const newTaches = [...taches];
        newTaches[tacheIndex].documents.splice(docIndex, 1);
        setTaches(newTaches);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Sauvegarder le sujet
            const { data: sujet, error: sujetError } = await supabase
                .from("sujets")
                .upsert({
                    id: initialData?.id,
                    titre_combinaison: titreCombinaison,
                })
                .select()
                .single();

            if (sujetError) throw sujetError;

            // 2. Sauvegarder les tâches
            for (const tache of taches) {
                const { data: savedTache, error: tacheError } = await supabase
                    .from("taches")
                    .upsert({
                        id: tache.id,
                        sujet_id: sujet.id,
                        numero_tache: tache.numero_tache,
                        titre_tache: tache.titre_tache,
                        consigne: tache.consigne,
                        sujet_tache: tache.sujet_tache,
                        type_tache: tache.type_tache,
                    })
                    .select()
                    .single();

                if (tacheError) throw tacheError;

                // 3. Sauvegarder les documents (si nécessaire)
                // Note: Pour simplifier, on supprime les anciens documents et on réinsère tout
                // Ou on utilise une approche plus fine si nécessaire. 
                // Ici on va faire simple pour le MVP.
                if (tache.id) {
                    await supabase.from("documents").delete().eq("tache_id", savedTache.id);
                }

                if (tache.documents.length > 0) {
                    const docsToInsert = tache.documents.map(doc => ({
                        tache_id: savedTache.id,
                        titre_document: doc.titre_document,
                        contenu: doc.contenu,
                    }));

                    const { error: docsError } = await supabase
                        .from("documents")
                        .insert(docsToInsert);

                    if (docsError) throw docsError;
                }
            }

            if (onSuccess) onSuccess();
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="card bg-surface-card p-6 border-surface-border">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre de la combinaison
                </label>
                <input
                    type="text"
                    value={titreCombinaison}
                    onChange={(e) => setTitreCombinaison(e.target.value)}
                    placeholder="Ex: Combinaison d'entraînement #1"
                    className="input"
                />
            </div>

            <div className="space-y-4">
                {taches.map((tache, index) => (
                    <div key={tache.numero_tache} className="card bg-surface-card border-surface-border overflow-hidden">
                        <button
                            onClick={() => setExpandedTache(expandedTache === tache.numero_tache ? null : tache.numero_tache)}
                            className="w-full flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 font-bold text-sm">
                                    T{tache.numero_tache}
                                </span>
                                <span className="font-semibold text-gray-200">
                                    {tache.titre_tache || `Tâche ${tache.numero_tache}`}
                                </span>
                            </div>
                            {expandedTache === tache.numero_tache ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                        </button>

                        {expandedTache === tache.numero_tache && (
                            <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                        Titre de la tâche
                                    </label>
                                    <input
                                        type="text"
                                        value={tache.titre_tache}
                                        onChange={(e) => handleTacheChange(index, "titre_tache", e.target.value)}
                                        placeholder="Ex: Message informel à un ami"
                                        className="input text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                        Sujet (contexte)
                                    </label>
                                    <textarea
                                        value={tache.sujet_tache}
                                        onChange={(e) => handleTacheChange(index, "sujet_tache", e.target.value)}
                                        placeholder="Ex: Vous allez fêter votre anniversaire. Vous envoyez un message à vos amis pour les inviter."
                                        rows={3}
                                        className="input min-h-[80px] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                        Consigne (instructions)
                                    </label>
                                    <textarea
                                        value={tache.consigne}
                                        onChange={(e) => handleTacheChange(index, "consigne", e.target.value)}
                                        placeholder="Ex: Vous leur décrivez le programme de la soirée et leur demandez de l’aide pour l’organisation"
                                        rows={4}
                                        className="input min-h-[100px] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                        Type de tâche
                                    </label>
                                    <select
                                        value={tache.type_tache}
                                        onChange={(e) => handleTacheChange(index, "type_tache", e.target.value)}
                                        className="input"
                                    >
                                        <option value="simple">Simple</option>
                                        <option value="documentaire">Documentaire (avec documents)</option>
                                    </select>
                                </div>

                                {tache.type_tache === "documentaire" && (
                                    <div className="space-y-4 pt-4 border-t border-surface-border/50">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-300">Documents</h4>
                                            <button
                                                onClick={() => addDocument(index)}
                                                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Ajouter un document
                                            </button>
                                        </div>

                                        {tache.documents.map((doc, docIndex) => (
                                            <div key={docIndex} className="p-4 rounded-xl border border-surface-border bg-surface/30 space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <input
                                                        type="text"
                                                        value={doc.titre_document}
                                                        onChange={(e) => handleDocumentChange(index, docIndex, "titre_document", e.target.value)}
                                                        placeholder="Titre du document"
                                                        className="input text-xs py-1.5"
                                                    />
                                                    <button
                                                        onClick={() => removeDocument(index, docIndex)}
                                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={doc.contenu}
                                                    onChange={(e) => handleDocumentChange(index, docIndex, "contenu", e.target.value)}
                                                    placeholder="Contenu du document (Supporte le HTML basique)"
                                                    rows={3}
                                                    className="input text-xs py-1.5 resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={loading || !titreCombinaison}
                className={cn(
                    "btn-primary w-full py-4 text-base justify-center shadow-lg shadow-brand-500/20",
                    loading && "opacity-70 cursor-wait"
                )}
            >
                <Save className="h-5 w-5" />
                {loading ? "Enregistrement..." : "Enregistrer la combinaison"}
            </button>
        </div>
    );
}
