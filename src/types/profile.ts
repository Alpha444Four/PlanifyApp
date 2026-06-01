import type { AppLanguage } from "@/lib/localization/languages";

export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export type MainGoal =
  | "lose_weight"
  | "gain_muscle"
  | "maintain"
  | "reduce_stress"
  | "improve_sleep"
  | "drink_water";

export interface UserPreferences {
  goals: string;
  fitnessLevel: FitnessLevel;
  mainGoal: MainGoal;
  /** Preset avatar id or null when using custom upload / OAuth photo. */
  avatarPreset: string | null;
  /** Dossier: darija, français, anglais, arabe. */
  languagePref: AppLanguage;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  goals: "",
  fitnessLevel: "beginner",
  mainGoal: "maintain",
  avatarPreset: "aurora",
  languagePref: "darija",
};

export const AVATAR_PRESETS: { id: string; label: string; className: string }[] = [
  { id: "aurora", label: "Aurora", className: "bg-gradient-to-br from-primary to-accent" },
  { id: "ocean", label: "Ocean", className: "bg-gradient-to-br from-sky-500 to-cyan-600" },
  { id: "sunset", label: "Sunset", className: "bg-gradient-to-br from-amber-400 to-orange-600" },
  { id: "forest", label: "Forest", className: "bg-gradient-to-br from-emerald-500 to-teal-700" },
  { id: "violet", label: "Violet", className: "bg-gradient-to-br from-violet-500 to-fuchsia-600" },
  { id: "slate", label: "Slate", className: "bg-gradient-to-br from-slate-600 to-slate-900" },
];

export const MAIN_GOAL_OPTIONS: { value: MainGoal; label: string }[] = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "gain_muscle", label: "Gain muscle" },
  { value: "maintain", label: "Maintain" },
  { value: "reduce_stress", label: "Reduce stress" },
  { value: "improve_sleep", label: "Improve sleep" },
  { value: "drink_water", label: "Drink more water" },
];

export const FITNESS_LEVEL_OPTIONS: { value: FitnessLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
