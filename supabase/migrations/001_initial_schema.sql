-- ============================================================
-- TCF Canada AI+ — Schéma PostgreSQL (Supabase)
-- Fichier : supabase/migrations/001_initial_schema.sql
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profils utilisateurs ─────────────────────────────────────────────────────
CREATE TABLE public.profiles (
    id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username    TEXT        UNIQUE NOT NULL,
    nclc_target INT         NOT NULL DEFAULT 7 CHECK (nclc_target BETWEEN 5 AND 10),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Profils publics des candidats TCF Canada';

-- Création automatique du profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Sessions d'examen ────────────────────────────────────────────────────────
CREATE TABLE public.exams (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,
    is_locked    BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_exams_user_id ON public.exams(user_id);
COMMENT ON TABLE public.exams IS 'Sessions d examen des candidats';

-- ─── Tâches rédigées ─────────────────────────────────────────────────────────
CREATE TABLE public.tasks (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id          UUID        NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    task_number      INT         NOT NULL CHECK (task_number IN (1, 2, 3)),
    content          TEXT        NOT NULL,
    word_count       INT         NOT NULL DEFAULT 0,
    -- Données IA (remplies après analyse par Edge Function)
    ai_score         TEXT,         -- ex: "NCLC 7"
    ai_feedback      JSONB,        -- Rapport complet structuré
    ai_analyzed_at   TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (exam_id, task_number)  -- Une seule tâche par numéro par examen
);

CREATE INDEX idx_tasks_exam_id ON public.tasks(exam_id);
CREATE INDEX idx_tasks_ai_score ON public.tasks(ai_score);
COMMENT ON TABLE public.tasks IS 'Tâches rédigées et leur analyse IA';

-- ─── Feedbacks humains (peer-review) ─────────────────────────────────────────
CREATE TABLE public.feedbacks (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id    UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    author_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment    TEXT        NOT NULL,
    rating     INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (task_id, author_id)  -- Un seul feedback par auteur par tâche
);

CREATE INDEX idx_feedbacks_task_id ON public.feedbacks(task_id);
COMMENT ON TABLE public.feedbacks IS 'Feedbacks humains sur les textes soumis';

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Profils : lecture publique, modification uniquement par le propriétaire
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Exams : lecture + écriture uniquement par le propriétaire
CREATE POLICY "exams_select_own"     ON public.exams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "exams_insert_own"     ON public.exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exams_update_own"     ON public.exams FOR UPDATE USING (auth.uid() = user_id);

-- Tasks : lecture publique, insertion uniquement par le propriétaire de l'examen
CREATE POLICY "tasks_select_all"     ON public.tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert_own"     ON public.tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.exams WHERE id = exam_id AND user_id = auth.uid())
);
-- Mise à jour IA uniquement via service role (Edge Function)
-- Pas de policy UPDATE pour les users normaux

-- Feedbacks : lecture publique, insertion par utilisateurs connectés
CREATE POLICY "feedbacks_select_all" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "feedbacks_insert_auth" ON public.feedbacks FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "feedbacks_update_own" ON public.feedbacks FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "feedbacks_delete_own" ON public.feedbacks FOR DELETE USING (auth.uid() = author_id);

-- ============================================================
-- Activer Realtime sur feedbacks (pour le mur communauté)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
