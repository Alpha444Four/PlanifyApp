import {
  createDefaultAchievements,
  createDefaultChallenges,
  createDefaultDailyStats,
  type Achievement,
  type DailyChallenge,
  type DailyStats,
  type ScannedMeal,
} from "@/types/health";
import { DEFAULT_PREFERENCES, type UserPreferences } from "@/types/profile";
import {
  DEFAULT_SUBSCRIPTION,
  type UserSubscription,
} from "@/types/plans";



export type {

  Achievement,

  DailyChallenge,

  DailyStats,

  MoodLevel,

  MedalTier,

  ScannedMeal,

} from "@/types/health";



export interface Task {

  id: string;

  title: string;

  time?: string;

  tag?: string;

  done: boolean;

  createdAt: string;

}



export interface Habit {

  id: string;

  name: string;

  emoji: string;

  streak: number;

  week: boolean[];

  goalPerWeek: number;

}



export interface Reminder {

  id: string;

  title: string;

  time?: string;

  done: boolean;

  createdAt: string;

}



export interface Meal {

  id: string;

  name: string;

  calories: number;

  protein?: number;

  carbs?: number;

  fats?: number;

  time?: string;

  createdAt: string;

}



export interface RoutineItem {

  id: string;

  title: string;

  done: boolean;

}



export interface MoodSample {

  date: string;

  value: number;

  emoji: string;

}



export interface SleepEntry {

  timeSlept: string;

  quality: number;

  changePercent: number;

  startTime: string;

  endTime: string;

  stages: { label: string; minutes: number; color: string }[];

}



export interface WorkoutEntry {

  date: string;

  wodTitle: string;

  sessionTitle: string;

  sessionDuration: number;

  exercises: { name: string; detail: string; icon?: string }[];

}



export interface UserData {
  tasks: Task[];
  habits: Habit[];
  reminders: Reminder[];
  meals: Meal[];
  scannedMeals: ScannedMeal[];
  routineItems: RoutineItem[];
  moods: MoodSample[];
  daily: DailyStats;
  challenges: DailyChallenge[];
  achievements: Achievement[];
  preferences: UserPreferences;
  aiInteractions: number;
  streak: number;
  sleep: SleepEntry | null;
  workout: WorkoutEntry | null;
  /** Completed workout class ids today. */
  completedWorkouts: string[];
  breathingSessions: number;
  /** ISO date (YYYY-MM-DD) for rolling daily stat reset. */
  lastActiveDate?: string;
  subscription: UserSubscription;
}



export function createEmptyUserData(): UserData {

  return {

    tasks: [],

    habits: [],

    reminders: [],

    meals: [],

    scannedMeals: [],

    routineItems: [],

    moods: [],

    daily: createDefaultDailyStats(),

    challenges: createDefaultChallenges(),
    achievements: createDefaultAchievements(),
    preferences: { ...DEFAULT_PREFERENCES },
    aiInteractions: 0,

    streak: 0,

    sleep: null,

    workout: null,

    completedWorkouts: [],

    breathingSessions: 0,
    subscription: { ...DEFAULT_SUBSCRIPTION },

  };

}


