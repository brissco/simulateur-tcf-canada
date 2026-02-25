-- ============================================================
-- TCF Canada AI+ — Ajout du champ sujet_tache
-- Fichier : supabase/migrations/004_add_sujet_tache.sql
-- Permet de séparer le contexte (sujet) de la consigne
-- ============================================================

ALTER TABLE public.taches ADD COLUMN sujet_tache TEXT;

COMMENT ON COLUMN public.taches.sujet_tache IS 'Contexte de la tâche (ex: Vous allez fêter votre anniversaire)';
