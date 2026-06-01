import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createEmptyUserData,
  type Habit,
  type Meal,
  type Reminder,
  type Task,
  type UserData,
} from "@/types/data";
import type { MoodLevel, ScannedMeal } from "@/types/health";
import { DEFAULT_PREFERENCES, type UserPreferences } from "@/types/profile";
import { syncAchievements } from "@/services/awards-service";
import type { FoodScanResult } from "@/services/food-scanner-service";
import { sampleHabits, sampleMood, sampleSleepData } from "@/lib/mock-data/health";
import { sampleTodayWorkout } from "@/lib/mock-data/workout";
import { createDefaultChallenges, createDefaultDailyStats } from "@/types/health";
import { PLAN_DEFINITIONS } from "@/config/plans";
import { DEFAULT_SUBSCRIPTION, type PlanId } from "@/types/plans";

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Reset daily counters/challenges when the calendar day changes. */
function applyDailyReset(data: UserData): UserData {
  const today = todayDateKey();
  if (data.lastActiveDate === today) return data;
  const daily = createDefaultDailyStats();
  return {
    ...data,
    lastActiveDate: today,
    daily: {
      ...daily,
      waterGoalMl: data.daily.waterGoalMl || daily.waterGoalMl,
      stepsGoal: data.daily.stepsGoal || daily.stepsGoal,
    },
    challenges: createDefaultChallenges(),
    completedWorkouts: [],
    breathingSessions: 0,
    subscription: {
      ...data.subscription,
      aiMessagesToday: 0,
      foodScansToday: 0,
    },
  };
}

/**
 * USER DATA STORE — Planify
 * ---------------------------------------------------------------------------
 * Local, per-user persistence for tasks / habits / reminders / meals / routine.
 *
 * Isolation: all data lives under `dataByUser`, keyed by the user id. The app
 * only ever reads/writes the slice for `activeUserId`, so one user can NEVER see
 * another user's data — even though everything shares one localStorage blob.
 *
 * This store is the single local source of truth and the seam a real backend
 * would replace: swap the action bodies for Supabase calls (RLS-scoped by
 * user_id) and the components/services above stay unchanged.
 * ---------------------------------------------------------------------------
 */

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Stable, shared empty data bag. Returned (by reference) from selectors when
 * there is no active user, so zustand/useSyncExternalStore never sees a new
 * snapshot reference on every render (which would cause an update loop).
 * Treated as read-only — all mutations go through store actions on real slices.
 */
export const EMPTY_USER_DATA: UserData = createEmptyUserData();

/** Merge persisted slices with defaults (handles store version upgrades). */
export function normalizeUserData(raw: Partial<UserData> | undefined): UserData {
  const base = createEmptyUserData();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    daily: { ...base.daily, ...(raw.daily ?? {}) },
    challenges: raw.challenges?.length ? raw.challenges : base.challenges,
    achievements: raw.achievements?.length ? raw.achievements : base.achievements,
    scannedMeals: raw.scannedMeals ?? [],
    completedWorkouts: raw.completedWorkouts ?? [],
    breathingSessions: raw.breathingSessions ?? 0,
    preferences: { ...DEFAULT_PREFERENCES, ...(raw.preferences ?? {}) },
    subscription: {
      ...DEFAULT_SUBSCRIPTION,
      ...(raw.subscription ?? {}),
    },
  };
}

function finalize(data: UserData): UserData {
  const rolled = applyDailyReset(data);
  const synced = syncAchievements(rolled);
  const challenges = rolled.challenges.map((c) => {
    let progress = c.progress;
    if (c.id === "water") progress = rolled.daily.waterMl;
    if (c.id === "steps") progress = rolled.daily.steps;
    if (c.id === "meals") progress = rolled.meals.length + rolled.scannedMeals.length;
    if (c.id === "workout")
      progress =
        rolled.daily.trainingMinutes > 0 ? 1 : rolled.completedWorkouts.length;
    if (c.id === "sleep") progress = rolled.daily.sleepHours;
    if (c.id === "mood") progress = rolled.daily.mood ? 1 : 0;
    if (c.id === "breathe") progress = rolled.breathingSessions;
    const completed = progress >= c.target;
    return { ...c, progress, completed };
  });
  return { ...rolled, achievements: synced, challenges };
}

interface UserDataState {
  activeUserId: string | null;
  dataByUser: Record<string, UserData>;

  /** Point the store at a user (called on sign-in / session restore). */
  setActiveUser: (userId: string | null) => void;
  /** Create a zeroed data bag for a user if one does not exist yet. */
  ensureUser: (userId: string) => void;
  /** Read the active user's data (empty bag if none). */
  getActiveData: () => UserData;

  addTask: (input: { title: string; time?: string; tag?: string }) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  addHabit: (input: { name: string; emoji?: string; goalPerWeek?: number }) => void;
  toggleHabitToday: (id: string) => void;

  addReminder: (input: { title: string; time?: string }) => void;
  toggleReminder: (id: string) => void;

  addMeal: (input: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    time?: string;
  }) => void;
  saveScannedMeal: (scan: FoodScanResult, imageName?: string) => void;

  addWater: (ml: number) => void;
  setSteps: (steps: number) => void;
  logSleep: (hours: number, quality: number) => void;
  logTrainingMinutes: (minutes: number) => void;
  completeWorkoutClass: (id: string, minutes: number, calories: number) => void;
  setMoodLevel: (mood: MoodLevel) => void;
  completeBreathing: () => void;

  setMood: (value: number) => void;
  incrementAiInteractions: () => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;

  /** Seed flagship demo data so the premium experience is showcasable. */
  loadSampleData: () => void;
  /** Wipe the active user's data back to zero. */
  resetActiveData: () => void;
  /** Re-run daily rollover (e.g. on app open). */
  touchDaily: () => void;
  setPlan: (planId: PlanId, periodEndIso?: string) => void;
  recordAiMessage: () => boolean;
  recordFoodScan: () => boolean;
}

/** Mutate the active user's data immutably; no-op when no active user. */
function updateActive(
  state: UserDataState,
  fn: (data: UserData) => UserData,
): Partial<UserDataState> {
  const id = state.activeUserId;
  if (!id) return {};
  const current = state.dataByUser[id] ?? createEmptyUserData();
  const next = fn(current);
  return {
    dataByUser: { ...state.dataByUser, [id]: finalize(next) },
  };
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      activeUserId: null,
      dataByUser: {},

      setActiveUser: (userId) => {
        set((state) => {
          if (!userId) return { activeUserId: null };
          const dataByUser = state.dataByUser[userId]
            ? state.dataByUser
            : { ...state.dataByUser, [userId]: createEmptyUserData() };
          return { activeUserId: userId, dataByUser };
        });
      },

      ensureUser: (userId) => {
        set((state) =>
          state.dataByUser[userId]
            ? {}
            : {
                dataByUser: {
                  ...state.dataByUser,
                  [userId]: createEmptyUserData(),
                },
              },
        );
      },

      getActiveData: () => {
        const { activeUserId, dataByUser } = get();
        if (!activeUserId) return EMPTY_USER_DATA;
        return finalize(normalizeUserData(dataByUser[activeUserId]));
      },

      addTask: (input) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            tasks: [
              {
                id: uid(),
                title: input.title,
                time: input.time,
                tag: input.tag,
                done: false,
                createdAt: new Date().toISOString(),
              } satisfies Task,
              ...d.tasks,
            ],
          })),
        ),

      toggleTask: (id) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            tasks: d.tasks.map((t) =>
              t.id === id ? { ...t, done: !t.done } : t,
            ),
          })),
        ),

      removeTask: (id) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            tasks: d.tasks.filter((t) => t.id !== id),
          })),
        ),

      addHabit: (input) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            habits: [
              {
                id: uid(),
                name: input.name,
                emoji: input.emoji ?? "✅",
                streak: 0,
                week: [false, false, false, false, false, false, false],
                goalPerWeek: input.goalPerWeek ?? 7,
              } satisfies Habit,
              ...d.habits,
            ],
          })),
        ),

      toggleHabitToday: (id) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            habits: d.habits.map((h) => {
              if (h.id !== id) return h;
              const week = [...h.week];
              const last = week.length - 1;
              const wasDone = week[last];
              week[last] = !wasDone;
              return {
                ...h,
                week,
                streak: wasDone ? Math.max(0, h.streak - 1) : h.streak + 1,
              };
            }),
          })),
        ),

      addReminder: (input) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            reminders: [
              {
                id: uid(),
                title: input.title,
                time: input.time,
                done: false,
                createdAt: new Date().toISOString(),
              } satisfies Reminder,
              ...d.reminders,
            ],
          })),
        ),

      toggleReminder: (id) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            reminders: d.reminders.map((r) =>
              r.id === id ? { ...r, done: !r.done } : r,
            ),
          })),
        ),

      addMeal: (input) =>
        set((state) =>
          updateActive(state, (d) => {
            const meal: Meal = {
              id: uid(),
              name: input.name,
              calories: input.calories,
              protein: input.protein,
              carbs: input.carbs,
              fats: input.fats,
              time: input.time,
              createdAt: new Date().toISOString(),
            };
            return {
              ...d,
              meals: [meal, ...d.meals],
              daily: {
                ...d.daily,
                calories: d.daily.calories + input.calories,
                protein: d.daily.protein + (input.protein ?? 0),
                carbs: d.daily.carbs + (input.carbs ?? 0),
                fats: d.daily.fats + (input.fats ?? 0),
              },
            };
          }),
        ),

      saveScannedMeal: (scan, imageName) =>
        set((state) =>
          updateActive(state, (d) => {
            const entry: ScannedMeal = {
              id: uid(),
              name: scan.name,
              calories: scan.calories,
              protein: scan.protein,
              carbs: scan.carbs,
              fats: scan.fats,
              confidence: scan.confidence,
              imageName,
              createdAt: new Date().toISOString(),
            };
            return {
              ...d,
              scannedMeals: [entry, ...d.scannedMeals],
              meals: [
                {
                  id: entry.id,
                  name: scan.name,
                  calories: scan.calories,
                  protein: scan.protein,
                  carbs: scan.carbs,
                  fats: scan.fats,
                  createdAt: entry.createdAt,
                },
                ...d.meals,
              ],
              daily: {
                ...d.daily,
                calories: d.daily.calories + scan.calories,
                protein: d.daily.protein + scan.protein,
                carbs: d.daily.carbs + scan.carbs,
                fats: d.daily.fats + scan.fats,
              },
            };
          }),
        ),

      addWater: (ml) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            daily: { ...d.daily, waterMl: d.daily.waterMl + ml },
          })),
        ),

      setSteps: (steps) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            daily: { ...d.daily, steps },
          })),
        ),

      logSleep: (hours, quality) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            daily: { ...d.daily, sleepHours: hours, sleepQuality: quality },
          })),
        ),

      logTrainingMinutes: (minutes) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            daily: {
              ...d.daily,
              trainingMinutes: d.daily.trainingMinutes + minutes,
            },
          })),
        ),

      completeWorkoutClass: (id, minutes, calories) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            completedWorkouts: d.completedWorkouts.includes(id)
              ? d.completedWorkouts
              : [...d.completedWorkouts, id],
            daily: {
              ...d.daily,
              trainingMinutes: d.daily.trainingMinutes + minutes,
              calories: d.daily.calories + calories,
            },
          })),
        ),

      setMoodLevel: (mood) =>
        set((state) =>
          updateActive(state, (d) => {
            const emojiMap: Record<MoodLevel, string> = {
              great: "😄",
              good: "🙂",
              okay: "😐",
              low: "😔",
              stressed: "😰",
              tired: "😴",
            };
            const valueMap: Record<MoodLevel, number> = {
              great: 5,
              good: 4,
              okay: 3,
              low: 2,
              stressed: 2,
              tired: 2,
            };
            const today = new Date().toLocaleDateString(undefined, {
              weekday: "short",
            });
            return {
              ...d,
              daily: { ...d.daily, mood },
              moods: [
                ...d.moods.filter((m) => m.date !== today),
                {
                  date: today,
                  value: valueMap[mood],
                  emoji: emojiMap[mood],
                },
              ],
            };
          }),
        ),

      completeBreathing: () =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            breathingSessions: d.breathingSessions + 1,
          })),
        ),

      setMood: (value) =>
        set((state) =>
          updateActive(state, (d) => {
            const emoji = ["😔", "😕", "😐", "🙂", "😄"][
              Math.max(0, Math.min(4, value - 1))
            ];
            const today = new Date().toLocaleDateString(undefined, {
              weekday: "short",
            });
            const existing = d.moods.filter((m) => m.date !== today);
            return {
              ...d,
              moods: [...existing, { date: today, value, emoji }],
            };
          }),
        ),

      incrementAiInteractions: () =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            aiInteractions: d.aiInteractions + 1,
          })),
        ),

      updatePreferences: (patch) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            preferences: { ...d.preferences, ...patch },
          })),
        ),

      loadSampleData: () =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            habits: d.habits.length ? d.habits : sampleHabits.map((h) => ({ ...h })),
            tasks: d.tasks.length
              ? d.tasks
              : [
                  { id: uid(), title: "Morning warm-up session", time: "07:30", tag: "Gym", done: true, createdAt: new Date().toISOString() },
                  { id: uid(), title: "Deep work: product spec", time: "09:00", tag: "Work", done: false, createdAt: new Date().toISOString() },
                  { id: uid(), title: "Read 20 minutes", time: "13:00", tag: "Personal", done: false, createdAt: new Date().toISOString() },
                  { id: uid(), title: "Study: Spanish lesson", time: "18:30", tag: "Study", done: false, createdAt: new Date().toISOString() },
                ],
            meals: d.meals.length
              ? d.meals
              : [
                  { id: uid(), name: "Overnight oats & berries", calories: 420, time: "08:00", createdAt: new Date().toISOString() },
                  { id: uid(), name: "Grilled chicken bowl", calories: 610, time: "13:00", createdAt: new Date().toISOString() },
                ],
            reminders: d.reminders.length
              ? d.reminders
              : [
                  { id: uid(), title: "Wind-down & lights out", time: "23:00", done: false, createdAt: new Date().toISOString() },
                ],
            moods: d.moods.length ? d.moods : sampleMood.map((m) => ({ ...m })),
            streak: d.streak || 12,
            aiInteractions: d.aiInteractions || 3,
            sleep: d.sleep ?? { ...sampleSleepData },
            workout: d.workout ?? { ...sampleTodayWorkout },
            daily: {
              ...d.daily,
              calories: 1150,
              protein: 86,
              carbs: 120,
              fats: 42,
              steps: 6420,
              waterMl: 1600,
              trainingMinutes: 45,
              sleepHours: 7.5,
              sleepQuality: 72,
              mood: "good",
            },
            breathingSessions: 1,
          })),
        ),

      resetActiveData: () =>
        set((state) => updateActive(state, () => createEmptyUserData())),

      touchDaily: () => set((state) => updateActive(state, (d) => d)),

      setPlan: (planId, periodEndIso) =>
        set((state) =>
          updateActive(state, (d) => ({
            ...d,
            subscription: {
              ...d.subscription,
              planId,
              status: "active",
              currentPeriodEnd: periodEndIso,
            },
          })),
        ),

      recordAiMessage: () => {
        let allowed = false;
        set((state) => {
          const id = state.activeUserId;
          if (!id) return {};
          const d = finalize(normalizeUserData(state.dataByUser[id]));
          const max = PLAN_DEFINITIONS[d.subscription.planId].limits.aiMessagesPerDay;
          if (d.subscription.aiMessagesToday >= max) return {};
          allowed = true;
          return updateActive(state, (data) => ({
            ...data,
            subscription: {
              ...data.subscription,
              aiMessagesToday: data.subscription.aiMessagesToday + 1,
            },
          }));
        });
        return allowed;
      },

      recordFoodScan: () => {
        let allowed = false;
        set((state) => {
          const id = state.activeUserId;
          if (!id) return {};
          const d = finalize(normalizeUserData(state.dataByUser[id]));
          const max = PLAN_DEFINITIONS[d.subscription.planId].limits.foodScansPerDay;
          if (d.subscription.foodScansToday >= max) return {};
          allowed = true;
          return updateActive(state, (data) => ({
            ...data,
            subscription: {
              ...data.subscription,
              foodScansToday: data.subscription.foodScansToday + 1,
            },
          }));
        });
        return allowed;
      },
    }),
    {
      name: "planify:user-data",
      version: 4,
      migrate: (persisted, _version) => {
        const state = persisted as UserDataState;
        if (state.dataByUser) {
          const migrated: Record<string, UserData> = {};
          for (const [id, data] of Object.entries(state.dataByUser)) {
            migrated[id] = normalizeUserData(data as UserData);
          }
          return { ...state, dataByUser: migrated };
        }
        return state;
      },
      // activeUserId is session-ish but harmless to persist; it is re-set on
      // every sign-in / session restore from the auth layer regardless.
      partialize: (state) => ({
        activeUserId: state.activeUserId,
        dataByUser: state.dataByUser,
      }),
    },
  ),
);
