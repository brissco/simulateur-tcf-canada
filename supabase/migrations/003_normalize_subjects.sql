-- ============================================================
-- TCF Canada AI+ — Normalisation du schéma sujets
-- Fichier : supabase/migrations/003_normalize_subjects.sql
-- Migre de subjects (flat) → sujets / taches / documents
-- ============================================================

-- ─── 1. Nouvelles tables ───────────────────────────────────────────────────

CREATE TABLE public.sujets (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    titre_combinaison  TEXT        NOT NULL,
    created_at         TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.sujets IS 'Sujets d examen (combinaisons)';

CREATE TABLE public.taches (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    sujet_id      UUID        NOT NULL REFERENCES public.sujets(id) ON DELETE CASCADE,
    numero_tache  INT         NOT NULL CHECK (numero_tache IN (1, 2, 3)),
    titre_tache   TEXT,
    consigne      TEXT,
    type_tache    TEXT        CHECK (type_tache IN ('simple', 'documentaire')),
    created_at    TIMESTAMPTZ DEFAULT now(),
    UNIQUE (sujet_id, numero_tache)
);

COMMENT ON TABLE public.taches IS 'Tâches associées à chaque sujet';

CREATE TABLE public.documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tache_id        UUID NOT NULL REFERENCES public.taches(id) ON DELETE CASCADE,
    titre_document  TEXT,
    contenu         TEXT NOT NULL
);

COMMENT ON TABLE public.documents IS 'Documents de référence pour les taches documentaires';

-- ─── 2. Mettre à jour la FK exams.subject_id → sujets ─────────────────────

-- Supprimer l'ancienne FK si elle existe
ALTER TABLE public.exams DROP CONSTRAINT IF EXISTS exams_subject_id_fkey;

-- Supprimer l'ancienne table subjects
DROP TABLE IF EXISTS public.subjects CASCADE;

-- Ajouter la nouvelle FK vers sujets
ALTER TABLE public.exams
    ADD CONSTRAINT exams_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.sujets(id);

-- ─── 3. RLS ───────────────────────────────────────────────────────────────

ALTER TABLE public.sujets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sujets_select_all"    ON public.sujets    FOR SELECT USING (true);
CREATE POLICY "taches_select_all"    ON public.taches    FOR SELECT USING (true);
CREATE POLICY "documents_select_all" ON public.documents FOR SELECT USING (true);

-- ─── 4. Index ─────────────────────────────────────────────────────────────

CREATE INDEX idx_taches_sujet_id    ON public.taches(sujet_id);
CREATE INDEX idx_documents_tache_id ON public.documents(tache_id);
