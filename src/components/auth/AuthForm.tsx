"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "register") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { username } },
                });
                if (error) throw error;
                router.push("/dashboard");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/dashboard");
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Erreur d'authentification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                        Nom d'utilisateur
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: brice_tcf"
                        className="input"
                        required
                        minLength={3}
                    />
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Adresse email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="input"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Mot de passe
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input pr-10"
                        required
                        minLength={8}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-400 rounded-lg bg-red-950/30 border border-red-800/40 p-3">
                    {error}
                </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>

            <p className="text-center text-sm text-gray-500">
                {mode === "login" ? (
                    <>Pas encore de compte ?{" "}
                        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
                            S'inscrire
                        </Link>
                    </>
                ) : (
                    <>Déjà inscrit ?{" "}
                        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
                            Se connecter
                        </Link>
                    </>
                )}
            </p>
        </form>
    );
}
