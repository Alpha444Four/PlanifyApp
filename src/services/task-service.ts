import { formatTemplate } from "@/lib/localization";
import { DEFAULT_LANGUAGE } from "@/lib/localization/languages";
import {
  getReminderSettings,
  pushNotification,
  showBrowserNotification,
} from "@/services/notification-service";
import { useUserDataStore } from "@/store/user-data-store";
import type { Task } from "@/types/data";

/**
 * TASK SERVICE — Planify
 * ---------------------------------------------------------------------------
 * Thin seam over the local per-user data store. Components call these instead of
 * touching storage directly, so swapping to a backend later (e.g. a `tasks`
 * table with RLS) is a one-file change.
 * ---------------------------------------------------------------------------
 */

export function listTasks(): Task[] {
  return useUserDataStore.getState().getActiveData().tasks;
}

export function addTask(input: { title: string; time?: string; tag?: string }): void {
  useUserDataStore.getState().addTask(input);
}

export async function notifyTaskCompleted(taskTitle: string): Promise<void> {
  const prefs = useUserDataStore.getState().getActiveData().preferences;
  const lang = prefs.languagePref ?? DEFAULT_LANGUAGE;
  const t = formatTemplate("taskDone", lang, { title: taskTitle });
  await pushNotification({ title: t.title, body: t.body, kind: "task" });
  const settings = await getReminderSettings();
  if (settings.browserPush) {
    showBrowserNotification(t.title, t.body);
  }
}

export function toggleTask(id: string): void {
  const store = useUserDataStore.getState();
  const task = store.getActiveData().tasks.find((t) => t.id === id);
  const wasDone = task?.done ?? false;
  store.toggleTask(id);
  if (task && !wasDone) {
    void notifyTaskCompleted(task.title);
  }
}

export function removeTask(id: string): void {
  useUserDataStore.getState().removeTask(id);
}
