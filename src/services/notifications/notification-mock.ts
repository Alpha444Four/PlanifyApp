import { formatTemplate } from "@/lib/localization";
import type { AppLanguage } from "@/lib/localization/languages";
import { DEFAULT_LANGUAGE } from "@/lib/localization/languages";
import { useAuthStore } from "@/store/auth-store";

export type ReminderKind =
  | "water"
  | "meal"
  | "workout"
  | "sleep"
  | "mood"
  | "breathing"
  | "task";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: ReminderKind;
  read: boolean;
  createdAt: string;
}

export interface ReminderSettings {
  water: boolean;
  meal: boolean;
  workout: boolean;
  sleep: boolean;
  mood: boolean;
  breathing: boolean;
  browserPush: boolean;
}

const SETTINGS_KEY_PREFIX = "planify:reminder-settings:";
const NOTIFS_KEY_PREFIX = "planify:notifications:";
const LEGACY_NOTIFS_KEY = "planify:notifications";
const LEGACY_SETTINGS_KEY = "planify:reminder-settings";

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  water: true,
  meal: true,
  workout: true,
  sleep: true,
  mood: true,
  breathing: true,
  browserPush: false,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function settingsKey(userId: string): string {
  return `${SETTINGS_KEY_PREFIX}${userId}`;
}

function notifsKey(userId: string): string {
  return `${NOTIFS_KEY_PREFIX}${userId}`;
}

function migrateLegacyNotifications(userId: string): void {
  if (typeof window === "undefined") return;
  const legacy = localStorage.getItem(LEGACY_NOTIFS_KEY);
  if (!legacy) return;
  if (localStorage.getItem(notifsKey(userId))) return;
  localStorage.setItem(notifsKey(userId), legacy);
  localStorage.removeItem(LEGACY_NOTIFS_KEY);
}

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return DEFAULT_REMINDER_SETTINGS;
  const userId = currentUserId();
  if (!userId) return DEFAULT_REMINDER_SETTINGS;
  const key = settingsKey(userId);
  let raw = localStorage.getItem(key);
  if (!raw) {
    raw = localStorage.getItem(LEGACY_SETTINGS_KEY);
    if (raw) {
      localStorage.setItem(key, raw);
      localStorage.removeItem(LEGACY_SETTINGS_KEY);
    }
  }
  return safeParse(raw, DEFAULT_REMINDER_SETTINGS);
}

export function saveReminderSettings(s: ReminderSettings): void {
  const userId = currentUserId();
  if (!userId || typeof window === "undefined") return;
  localStorage.setItem(settingsKey(userId), JSON.stringify(s));
}

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  const userId = currentUserId();
  if (!userId) return [];
  migrateLegacyNotifications(userId);
  return safeParse(localStorage.getItem(notifsKey(userId)), []);
}

export function addNotification(
  n: Omit<AppNotification, "id" | "read" | "createdAt">,
): AppNotification | null {
  const userId = currentUserId();
  if (!userId || typeof window === "undefined") return null;
  migrateLegacyNotifications(userId);
  const list = getNotifications();
  const entry: AppNotification = {
    ...n,
    id: Math.random().toString(36).slice(2),
    read: false,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(
    notifsKey(userId),
    JSON.stringify([entry, ...list].slice(0, 50)),
  );
  return entry;
}

export function markAllRead(): void {
  const userId = currentUserId();
  if (!userId || typeof window === "undefined") return;
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(notifsKey(userId), JSON.stringify(list));
}

export function clearAllNotifications(): void {
  const userId = currentUserId();
  if (!userId || typeof window === "undefined") return;
  localStorage.setItem(notifsKey(userId), "[]");
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

export function checkSmartReminders(data: {
  waterMl: number;
  meals: number;
  moodSet: boolean;
  trainingMin: number;
  language?: AppLanguage;
  userName?: string;
}): void {
  const s = getReminderSettings();
  const lang = data.language ?? DEFAULT_LANGUAGE;
  const name = data.userName?.split(/\s+/)[0];

  if (s.water && data.waterMl < 500) {
    const t = formatTemplate("hydration", lang, { name });
    addNotification({ title: t.title, body: t.body, kind: "water" });
  }
  if (s.meal && data.meals === 0) {
    const t = formatTemplate("meal", lang, { name });
    addNotification({ title: t.title, body: t.body, kind: "meal" });
  }
  if (s.mood && !data.moodSet) {
    const t = formatTemplate("mood", lang, { name });
    addNotification({ title: t.title, body: t.body, kind: "mood" });
  }
  if (s.workout && data.trainingMin === 0) {
    const t = formatTemplate("workout", lang, { name });
    addNotification({ title: t.title, body: t.body, kind: "workout" });
  }
}
