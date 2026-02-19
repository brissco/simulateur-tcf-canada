import { AuthForm } from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-hero-glow">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <span className="text-brand-400">TCF</span> Canada AI+
                    </h1>
                    <p className="text-gray-400">Bienvenue ! Connectez-vous pour continuer.</p>
                </div>
                <div className="card">
                    <AuthForm mode="login" />
                </div>
            </div>
        </main>
    );
}
