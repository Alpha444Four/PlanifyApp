/** Aligné sur le dossier startup — 4 langues dont darija. */
export type AppLanguage = "darija" | "fr" | "en" | "ar";

export const LANGUAGE_OPTIONS: { value: AppLanguage; label: string; flag: string }[] = [
  { value: "darija", label: "Darija (Maroc)", flag: "🇲🇦" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ar", label: "العربية", flag: "🇲🇦" },
];

export const DEFAULT_LANGUAGE: AppLanguage = "darija";
