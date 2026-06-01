/** Mood levels for the stress/mood tracker. */
export type MoodLevel =
  | "great"
  | "good"
  | "okay"
  | "low"
  | "stressed"
  | "tired";

export type MedalTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond";

export interface DailyStats {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  steps: number;
  stepsGoal: number;
  waterMl: number;
  waterGoalMl: number;
  trainingMinutes: number;
  sleepHours: number;
  /** 0–100 sleep quality score. */
  sleepQuality: number;
  mood: MoodLevel | null;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: MedalTier;
  unlocked: boolean;
  /** 0–100 progress toward unlock. */
  progress: number;
  target: number;
}

export interface ScannedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  imageName?: string;
  createdAt: string;
}

export interface WorkoutClass {
  id: string;
  title: string;
  category: "gym" | "cardio" | "home" | "stretching" | "relax";
  difficulty: "Easy" | "Medium" | "Hard";
  durationMin: number;
  muscleGroup: string;
  instructions: string;
  videoUrl?: string;
  caloriesEstimate: number;
}

export function createDefaultDailyStats(): DailyStats {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    steps: 0,
    stepsGoal: 8000,
    waterMl: 0,
    waterGoalMl: 2500,
    trainingMinutes: 0,
    sleepHours: 0,
    sleepQuality: 0,
    mood: null,
  };
}

export function createDefaultChallenges(): DailyChallenge[] {
  return [
    {
      id: "water",
      title: "Hydration hero",
      description: "Drink your daily water goal",
      target: 2500,
      progress: 0,
      completed: false,
      icon: "💧",
    },
    {
      id: "steps",
      title: "Step warrior",
      description: "Walk 5,000+ steps",
      target: 5000,
      progress: 0,
      completed: false,
      icon: "👟",
    },
    {
      id: "meals",
      title: "Fuel your day",
      description: "Log 3 meals",
      target: 3,
      progress: 0,
      completed: false,
      icon: "🍽️",
    },
    {
      id: "workout",
      title: "Move your body",
      description: "Complete one workout",
      target: 1,
      progress: 0,
      completed: false,
      icon: "💪",
    },
    {
      id: "sleep",
      title: "Sleep master",
      description: "Log 7+ hours of sleep",
      target: 7,
      progress: 0,
      completed: false,
      icon: "🌙",
    },
    {
      id: "mood",
      title: "Check in",
      description: "Log your mood today",
      target: 1,
      progress: 0,
      completed: false,
      icon: "🧠",
    },
    {
      id: "breathe",
      title: "Calm mind",
      description: "Complete a breathing exercise",
      target: 1,
      progress: 0,
      completed: false,
      icon: "🌬️",
    },
  ];
}

export function createDefaultAchievements(): Achievement[] {
  return [
    { id: "first-meal", title: "First Meal Logged", description: "Log your first meal", tier: "bronze", unlocked: false, progress: 0, target: 1 },
    { id: "first-workout", title: "First Workout Done", description: "Complete your first workout", tier: "bronze", unlocked: false, progress: 0, target: 1 },
    { id: "streak-7", title: "7-Day Streak", description: "Stay consistent for a week", tier: "silver", unlocked: false, progress: 0, target: 7 },
    { id: "streak-30", title: "30-Day Streak", description: "A month of discipline", tier: "gold", unlocked: false, progress: 0, target: 30 },
    { id: "streak-100", title: "100-Day Streak", description: "Elite consistency", tier: "platinum", unlocked: false, progress: 0, target: 100 },
    { id: "streak-365", title: "Diamond Discipline", description: "365 days of showing up", tier: "diamond", unlocked: false, progress: 0, target: 365 },
    { id: "hydration", title: "Hydration Hero", description: "Hit water goal 7 days", tier: "silver", unlocked: false, progress: 0, target: 7 },
    { id: "sleep", title: "Sleep Master", description: "Log quality sleep 7 days", tier: "gold", unlocked: false, progress: 0, target: 7 },
    { id: "calm", title: "Calm Mind", description: "Complete 10 breathing sessions", tier: "silver", unlocked: false, progress: 0, target: 10 },
    { id: "steps", title: "Step Warrior", description: "Hit 10k steps in a day", tier: "gold", unlocked: false, progress: 0, target: 10000 },
  ];
}
