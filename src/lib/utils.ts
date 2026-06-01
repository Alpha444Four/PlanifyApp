import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Derive up-to-2-letter initials from a name (falls back to "U"). */
export function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Friendly label for the user's auth provider / plan. */
export function providerLabel(provider?: string): string {
  switch (provider) {
    case "google":
      return "Google account";
    case "apple":
      return "Apple account";
    default:
      return "Free plan";
  }
}
