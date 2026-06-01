import { useUserDataStore } from "@/store/user-data-store";
import type { Meal } from "@/types/data";

/**
 * CALORIES / MEALS SERVICE — Planify
 * ---------------------------------------------------------------------------
 * Thin seam over the local per-user data store (future: a `meals` table).
 * ---------------------------------------------------------------------------
 */

export function listMeals(): Meal[] {
  return useUserDataStore.getState().getActiveData().meals;
}

export function addMeal(input: {
  name: string;
  calories: number;
  time?: string;
}): void {
  useUserDataStore.getState().addMeal(input);
}

export function caloriesToday(): number {
  return useUserDataStore
    .getState()
    .getActiveData()
    .meals.reduce((sum, m) => sum + (m.calories || 0), 0);
}
