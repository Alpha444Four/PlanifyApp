import { useUserDataStore } from "@/store/user-data-store";
import type { Reminder } from "@/types/data";

/**
 * REMINDER SERVICE — Planify
 * ---------------------------------------------------------------------------
 * Thin seam over the local per-user data store (future: a `reminders` table).
 * ---------------------------------------------------------------------------
 */

export function listReminders(): Reminder[] {
  return useUserDataStore.getState().getActiveData().reminders;
}

export function addReminder(input: { title: string; time?: string }): void {
  useUserDataStore.getState().addReminder(input);
}

export function toggleReminder(id: string): void {
  useUserDataStore.getState().toggleReminder(id);
}
