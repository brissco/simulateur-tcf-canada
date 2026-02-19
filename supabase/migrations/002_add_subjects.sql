-- ============================================================
-- TCF Canada AI+ — Ajout de la gestion des sujets
-- Fichier : supabase/migrations/002_add_subjects.sql
-- ============================================================

-- ─── Table des sujets ──────────────────────────────────────────────────────
CREATE TABLE public.subjects (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    title        TEXT         NOT NULL,
    task1_prompt TEXT         NOT NULL,
    task2_prompt TEXT         NOT NULL,
    task3_prompt TEXT         NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.subjects IS 'Sujets d examen contenant les 3 tâches';

-- ─── Lier les examens aux sujets ─────────────────────────────────────────────
ALTER TABLE public.exams ADD COLUMN subject_id UUID REFERENCES public.subjects(id);
CREATE INDEX idx_exams_subject_id ON public.exams(subject_id);

-- ─── RLS pour les sujets ────────────────────────────────────────────────────
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects_select_all" ON public.subjects FOR SELECT USING (true);

-- ─── Seed : Ajout du sujet par défaut ────────────────────────────────────────
INSERT INTO public.subjects (title, task1_prompt, task2_prompt, task3_prompt)
VALUES (
    'Sujet Officiel #1',
    'Vous devez écrire un message informel à un ami pour lui décrire votre expérience récente au Canada. Utilisez un registre familier mais correct.',
    'Vous devez écrire un courriel à votre employeur pour demander un congé. Utilisez un registre semi-formel.',
    'Vous devez rédiger une lettre formelle à une institution (banque, mairie, école) pour faire une réclamation ou une demande officielle.'
);
