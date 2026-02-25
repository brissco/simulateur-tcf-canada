"use client";

import { useState, useEffect } from "react";
import { Plus, List, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { CombinationEditor } from "@/components/admin/CombinationEditor";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminSujetsPage() {
    const [view, setView] = useState<"list" | "create">("list");
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createSupabaseBrowserClient();

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("sujets")
                .select("id, titre_combinaison, created_at")
                .order("created_at", { ascending: false });

            if (data) setSubjects(data);
        } catch (e) {
            console.error("Error fetching subjects:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSuccess = () => {
        setView("list");
        fetchSubjects();
    };

    return (
        <div className="min-h-screen bg-surface-dark pb-20">
            <header className="sticky top-0 z-50 glass border-b border-surface-border">
                <div className="page-container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-surface-card rounded-lg transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-400" />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Gestion des Combinaisons</h1>
                    </div>
                    <button
                        onClick={() => setView(view === "list" ? "create" : "list")}
                        className="btn-primary py-2 px-4 text-sm"
                    >
                        {view === "list" ? (
                            <>
                                <Plus className="h-4 w-4" /> Nouvelle combinaison
                            </>
                        ) : (
                            <>
                                <List className="h-4 w-4" /> Voir la liste
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="page-container py-8">
                {view === "list" ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-200">Liste des sujets</h2>
                            <span className="text-sm text-gray-500">{subjects.length} combinaisons au total</span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
                                <p className="text-gray-500 text-sm">Chargement des sujets...</p>
                            </div>
                        ) : subjects.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {subjects.map((s) => (
                                    <div key={s.id} className="card bg-surface-card border-surface-border p-5 hover:border-brand-500/50 transition-all group">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <h3 className="font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                                    {s.titre_combinaison}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    ID: <span className="font-mono">{s.id.split('-')[0]}...</span>
                                                </p>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-surface-border/50 flex justify-between items-center text-[10px] text-gray-500">
                                                <span>Créé le {new Date(s.created_at).toLocaleDateString()}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-surface-dark border border-surface-border">
                                                    Normalisé
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 card bg-surface-card border-dashed border-2 border-surface-border">
                                <p className="text-gray-400">Aucune combinaison trouvée.</p>
                                <button
                                    onClick={() => setView("create")}
                                    className="mt-4 text-brand-400 hover:underline text-sm font-medium"
                                >
                                    Créer votre première combinaison
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="mb-8 text-center max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-2">Créer une nouvelle combinaison</h2>
                            <p className="text-gray-400 text-sm">
                                Définissez les trois tâches de l'examen. La tâche 3 doit être de type documentaire pour inclure des ressources.
                            </p>
                        </div>
                        <CombinationEditor onSuccess={handleSuccess} />
                    </div>
                )}
            </main>
        </div>
    );
}
