import { useUserDataStore } from "@/store/user-data-store";
import type { Habit } from "@/types/data";

/**
 * HABIT SERVICE — Planify
 * ---------------------------------------------------------------------------
 * Thin seam over the local per-user data store (future: a `habits` table).
 * ---------------------------------------------------------------------------
 */

export function listHabits(): Habit[] {
  return useUserDataStore.getState().getActiveData().habits;
}

export function addHabit(input: {
  name: string;
  emoji?: string;
  goalPerWeek?: number;
}): void {
  useUserDataStore.getState().addHabit(input);
}

export function toggleHabitToday(id: string): void {
  useUserDataStore.getState().toggleHabitToday(id);
}
