import type { Exercise } from "@/components/ui/workout-card";
import type { AiInsight } from "@/lib/mock-data/health";

/**
 * MOCK WORKOUT DATA — Planify
 * ---------------------------------------------------------------------------
 * Sample fitness data for MOCK mode, shaped for future DB models.
 *
 * Future DB model mapping:
 *   workout_plans      -> WeeklyProgramDay / "PLANIFY WOD" header
 *     id, user_id, week_start, title, generated_by_ai (bool)
 *   workout_exercises  -> Exercise (rows linked to a plan/session)
 *     id, plan_id, day, name, detail, target_reps, target_seconds, icon_key, order
 *   workout_logs       -> completed sessions (per user per day)
 *     id, user_id, date, plan_id, duration_minutes, completed (bool), notes
 * ---------------------------------------------------------------------------
 */

export type TodayWorkout = {
  date: string;
  wodTitle: string;
  sessionTitle: string;
  sessionDuration: number; // minutes
  exercises: Exercise[];
};

export const sampleTodayWorkout: TodayWorkout = {
  date: "Today",
  wodTitle: "PLANIFY WOD",
  sessionTitle: "Warm-Up Session",
  sessionDuration: 50,
  exercises: [
    { name: "Jumping Jacks", detail: "2 minutes", icon: "activity" },
    { name: "High Knees", detail: "4 minutes", icon: "flame" },
    { name: "Bicycle Crunches", detail: "20 reps", icon: "dumbbell" },
    { name: "Mountain Climbers", detail: "3 minutes", icon: "timer" },
    { name: "Bodyweight Squats", detail: "25 reps", icon: "dumbbell" },
  ],
};

export type WeeklyProgramDay = {
  day: string;
  focus: string;
  durationMin: number;
  intensity: "Low" | "Moderate" | "High";
  done: boolean;
};

export const sampleWeeklyProgram: WeeklyProgramDay[] = [
  { day: "Mon", focus: "Upper Body Strength", durationMin: 55, intensity: "High", done: true },
  { day: "Tue", focus: "HIIT Conditioning", durationMin: 35, intensity: "High", done: true },
  { day: "Wed", focus: "Active Recovery", durationMin: 30, intensity: "Low", done: false },
  { day: "Thu", focus: "Lower Body Power", durationMin: 50, intensity: "High", done: false },
  { day: "Fri", focus: "Warm-Up Session", durationMin: 50, intensity: "Moderate", done: false },
  { day: "Sat", focus: "Mobility & Core", durationMin: 40, intensity: "Moderate", done: false },
  { day: "Sun", focus: "Rest", durationMin: 0, intensity: "Low", done: false },
];

export type WorkoutProgress = {
  weeklyGoal: number;
  completed: number;
  minutesThisWeek: number;
  caloriesThisWeek: number;
};

export const sampleWorkoutProgress: WorkoutProgress = {
  weeklyGoal: 5,
  completed: 2,
  minutesThisWeek: 90,
  caloriesThisWeek: 1240,
};

export const workoutInsight: AiInsight = {
  id: "insight-workout",
  category: "workout",
  title: "Workout insight",
  body: "You missed Deep Recovery yesterday, so today's warm-up is lighter.",
};
