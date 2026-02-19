import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "TCF Canada AI+ — Simulateur d'Expression Écrite",
        template: "%s | TCF Canada AI+",
    },
    description:
        "Entraînez-vous à l'épreuve d'expression écrite du TCF Canada avec une correction IA instantanée et le soutien de la communauté.",
    keywords: ["TCF Canada", "NCLC", "expression écrite", "French test", "simulation"],
    openGraph: {
        title: "TCF Canada AI+",
        description: "Simulateur d'expression écrite avec correction IA et peer-review",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={inter.variable}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen bg-surface text-gray-100 antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
