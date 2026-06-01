import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "@/lib/api-client";
import type {
  AppNotification,
  ReminderKind,
  ReminderSettings,
} from "./notification-mock";

export type { AppNotification, ReminderKind, ReminderSettings };
export { DEFAULT_REMINDER_SETTINGS } from "./notification-mock";

let cachedSettings: ReminderSettings | null = null;

export async function getReminderSettings(): Promise<ReminderSettings> {
  if (cachedSettings) return cachedSettings;
  const res = await apiGet<{ ok: true; settings: ReminderSettings }>(
    "/api/notifications/settings",
  );
  cachedSettings = res.settings;
  return res.settings;
}

export async function saveReminderSettings(s: ReminderSettings): Promise<void> {
  const res = await apiPut<{ ok: true; settings: ReminderSettings }>(
    "/api/notifications/settings",
    s,
  );
  cachedSettings = res.settings;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const res = await apiGet<{ ok: true; notifications: AppNotification[] }>(
    "/api/notifications",
  );
  return res.notifications;
}

export async function createNotification(input: {
  title: string;
  body: string;
  kind: ReminderKind;
}): Promise<AppNotification | null> {
  const res = await apiPost<{ ok: true; notification: AppNotification }>(
    "/api/notifications",
    input,
  );
  return res.notification ?? null;
}

export function markAllRead(): Promise<void> {
  return apiPatch("/api/notifications/read-all").then(() => undefined);
}

export function clearAllNotifications(): Promise<void> {
  return apiDelete("/api/notifications").then(() => undefined);
}

export async function requestBrowserPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

export function showBrowserNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/favicon.svg" });
}

export async function checkSmartReminders(data: {
  waterMl: number;
  meals: number;
  moodSet: boolean;
  trainingMin: number;
  language?: string;
  userName?: string;
}): Promise<void> {
  await apiPost("/api/notifications/evaluate", data);
}

export function invalidateSettingsCache(): void {
  cachedSettings = null;
}
