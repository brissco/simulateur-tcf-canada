import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusion Tailwind + cn (pattern shadcn/ui) */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Compte le nombre de mots dans un texte.
 * Gère les apostrophes, traits d'union et caractères spéciaux français.
 */
export function countWords(text: string): number {
    if (!text || text.trim() === "") return 0;
    return text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
}

/**
 * Formate un nombre de secondes en MM:SS
 */
export function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Retourne le statut de conformité du nombre de mots
 */
export function getWordCountStatus(
    count: number,
    min: number,
    max: number
): "below" | "valid" | "above" {
    if (count < min) return "below";
    if (count > max) return "above";
    return "valid";
}

/**
 * Formate une date relative (ex: "il y a 3 minutes")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays}j`;
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Génère une couleur de score NCLC
 */
export function getNclcColor(level: string): string {
    const num = parseInt(level.replace(/\D/g, ""), 10);
    if (num >= 9) return "text-emerald-400";
    if (num >= 7) return "text-brand-400";
    if (num >= 5) return "text-amber-400";
    return "text-red-400";
}
