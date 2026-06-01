import type { SleepData } from "@/components/ui/sleep-tracker-card";

/**
 * MOCK HEALTH DATA — Planify
 * ---------------------------------------------------------------------------
 * This module provides sample health data while the app runs in MOCK mode.
 * It is shaped to map cleanly onto future database models so the UI does not
 * need to change once a real backend / AI layer is wired in.
 *
 * Future DB model mapping:
 *   sleep_logs        -> SleepData (one row per night per user)
 *     id, user_id, date, time_slept_minutes, quality_score, change_percent,
 *     start_time, end_time
 *   sleep_stages      -> SleepData.stages (rows linked to sleep_logs.id)
 *     id, sleep_log_id, label, minutes, color_token
 *   health_metrics    -> recoveryScore, mood samples, etc.
 *     id, user_id, date, metric_type, value, meta(jsonb)
 * ---------------------------------------------------------------------------
 */

export const sampleSleepData: SleepData = {
  timeSlept: "5:44",
  quality: 72,
  changePercent: 16,
  startTime: "01:42",
  endTime: "07:26",
  stages: [
    { label: "Awake", minutes: 14, color: "#f59e0b" },
    { label: "REM", minutes: 64, color: "#a78bfa" },
    { label: "Core", minutes: 248, color: "#3b82f6" },
    { label: "Deep", minutes: 18, color: "#6366f1" },
  ],
};

export type RecoveryScore = {
  score: number; // 0 - 100
  label: string;
  description: string;
};

export const sampleRecovery: RecoveryScore = {
  score: 68,
  label: "Moderate",
  description:
    "Your body is partially recovered. Favor low-impact movement and prioritize an earlier bedtime tonight.",
};

export type MoodSample = {
  date: string; // ISO or short label
  /** 1 (low) - 5 (great) */
  value: number;
  emoji: string;
};

export const sampleMood: MoodSample[] = [
  { date: "Mon", value: 3, emoji: "😐" },
  { date: "Tue", value: 4, emoji: "🙂" },
  { date: "Wed", value: 2, emoji: "😔" },
  { date: "Thu", value: 4, emoji: "🙂" },
  { date: "Fri", value: 5, emoji: "😄" },
  { date: "Sat", value: 4, emoji: "🙂" },
  { date: "Sun", value: 3, emoji: "😐" },
];

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  /** completion across the last 7 days, oldest first */
  week: boolean[];
  goalPerWeek: number;
};

export const sampleHabits: Habit[] = [
  {
    id: "hydrate",
    name: "Drink 2L water",
    emoji: "💧",
    streak: 12,
    week: [true, true, true, false, true, true, true],
    goalPerWeek: 7,
  },
  {
    id: "read",
    name: "Read 20 min",
    emoji: "📚",
    streak: 5,
    week: [true, false, true, true, true, false, true],
    goalPerWeek: 5,
  },
  {
    id: "meditate",
    name: "Meditate",
    emoji: "🧘",
    streak: 3,
    week: [false, true, true, true, false, false, true],
    goalPerWeek: 4,
  },
  {
    id: "nosugar",
    name: "No added sugar",
    emoji: "🚫🍬",
    streak: 2,
    week: [true, true, false, false, true, true, false],
    goalPerWeek: 6,
  },
];

export type AiInsight = {
  id: string;
  category: "sleep" | "workout" | "mood" | "general";
  title: string;
  body: string;
};

export const sleepInsight: AiInsight = {
  id: "insight-sleep",
  category: "sleep",
  title: "Sleep insight",
  body: "Your sleep quality was 72%. Try sleeping 45 minutes earlier tonight to improve recovery.",
};

export const moodInsight: AiInsight = {
  id: "insight-mood",
  category: "mood",
  title: "Mood pattern",
  body: "Your mood dips midweek. A short walk after lunch on Wednesdays may help stabilize energy.",
};
