# TCF Canada AI+ 🇨🇦

> Simulateur d'expression écrite pour le TCF Canada avec correction IA (Gemini) et peer-review communautaire.

## Stack

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Auth & DB | Supabase (PostgreSQL + SSR Auth) |
| Temps réel | Supabase Realtime |
| IA | Google Gemini 1.5 Pro via Edge Function |
| État global | Zustand (persist + devtools) |
| Déploiement | Vercel |

## Démarrage rapide

### 1. Prérequis
- Node.js 18+ et npm
- Compte [Supabase](https://supabase.com) (gratuit)
- Clé API [Google Gemini](https://aistudio.google.com/)

### 2. Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier de config
cp .env.example .env.local
# Remplir les variables dans .env.local
```

### 3. Supabase

```bash
# Option A — Via l'interface Supabase Studio
# Collez le contenu de supabase/migrations/001_initial_schema.sql dans SQL Editor

# Option B — Via CLI Supabase
supabase login
supabase link --project-ref VOTRE_PROJECT_ID
supabase db push
```

### 4. Déployer l'Edge Function

```bash
supabase functions deploy analyze-task --project-ref VOTRE_PROJECT_ID

# Ajouter les secrets à la fonction
supabase secrets set GEMINI_API_KEY=votre_cle
```

### 5. Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Layout racine
│   ├── globals.css           # Design system
│   ├── login/page.tsx        # Connexion
│   ├── register/page.tsx     # Inscription
│   ├── exam/page.tsx         # Mode Examen
│   ├── community/
│   │   └── [taskId]/page.tsx # Peer-review
│   └── api/
│       └── submit-exam/route.ts
├── components/
│   ├── exam/
│   │   ├── ExamTimer.tsx       # Compte à rebours
│   │   ├── TaskEditor.tsx      # Éditeur sécurisé
│   │   └── AIFeedbackPanel.tsx # Rapport IA
│   └── auth/
│       └── AuthForm.tsx        # Formulaire auth
├── lib/
│   ├── ai.ts                   # Wrapper Gemini
│   ├── utils.ts                # Utilitaires
│   └── supabase/
│       ├── server.ts           # Client SSR
│       └── client.ts           # Client browser
├── store/
│   └── examStore.ts            # Store Zustand
├── types/
│   └── database.ts             # Types DB + domaine
└── middleware.ts               # Auth middleware

supabase/
├── migrations/
│   └── 001_initial_schema.sql  # Schéma PostgreSQL + RLS
└── functions/
    └── analyze-task/index.ts   # Edge Function Deno + Gemini
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (Edge Functions uniquement) |
| `GEMINI_API_KEY` | Clé API Google Gemini |

## Paradigmes utilisés

- **App Router + Server Components** : rendu serveur par défaut, Client Components ciblés (`"use client"`)
- **SSR Auth** : `@supabase/ssr` avec middleware pour refresh automatique du token
- **Row Level Security** : sécurité au niveau DB, pas seulement applicatif
- **Zustand + persist** : état exam persisté en localStorage (résistant aux rechargements)
- **Edge Functions Deno** : appels IA sécurisés côté serveur (clé API non exposée)
- **Fire & Forget** : soumission non-bloquante → réponse rapide + polling/realtime côté client
- **Realtime** : feedbacks communautaires en temps réel via PostgreSQL CDC

---

*Projet Maisonier / Brice — Février 2026*
