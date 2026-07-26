import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSize(bytes: number): string {
    if (bytes <= 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${parseFloat(size.toFixed(2))} ${units[i]}`;
}

export const generateUUID = () => {
    return crypto.randomUUID();
}

/**
 * The model is asked for bare JSON, but it sometimes wraps it in a markdown
 * fence or adds a sentence around it. Pull out the JSON object before parsing.
 */
export const parseFeedback = (raw: string): Feedback => {
    const withoutFence = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");

    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("No JSON object found in the AI response");
    }

    return JSON.parse(withoutFence.slice(start, end + 1)) as Feedback;
}