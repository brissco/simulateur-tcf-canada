"use client";

import type { TaskDocument } from "@/types/database";

interface Task3DisplayProps {
    /** Titre / consigne de la tâche 3 (ex: "Le travail des jeunes pendant les vacances") */
    consigne: string;
    /** Documents de référence associés */
    documents: TaskDocument[];
}

export function Task3Display({ consigne, documents }: Task3DisplayProps) {
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {/* Titre du Sujet */}
            <h2 className="text-xl font-bold text-center text-blue-500 mb-2">
                {consigne}
            </h2>

            {/* Documents Container */}
            <div className="flex flex-col gap-6 relative">

                {/* Filigrane (Watermark) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
                    <div className="transform -rotate-12 text-center">
                        <span className="block text-[8rem] font-bold text-gray-900 leading-none">tcf</span>
                        <span className="block text-[6rem] font-bold text-gray-900 leading-none tracking-widest">CANADA</span>
                    </div>
                </div>

                {/* Documents dynamiques */}
                {documents.map((doc) => (
                    <div key={doc.id} className="relative z-10">
                        <h3 className="text-blue-600 font-bold underline mb-2 text-sm">
                            {doc.titre_document ?? "Document"} :
                        </h3>
                        <div className="rounded-xl border-2 border-blue-400 bg-white/5 p-6 backdrop-blur-sm">
                            <p className="text-gray-200 text-sm leading-relaxed text-justify">
                                « {doc.contenu} »
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
