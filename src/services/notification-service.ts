/**
 * NOTIFICATION SERVICE — facade
 * Backend mode: SQLite + REST. Mock mode: per-user localStorage.
 */
import { useRealApi } from "@/lib/env";
import { useNotificationStore } from "@/store/notification-store";
import * as api from "@/services/notifications/notification-api";
import * as mock from "@/services/notifications/notification-mock";

export type {
  AppNotification,
  ReminderKind,
  ReminderSettings,
} from "@/services/notifications/notification-mock";

export const DEFAULT_REMINDER_SETTINGS = mock.DEFAULT_REMINDER_SETTINGS;

function isApi(): boolean {
  return useRealApi();
}

export async function getReminderSettings(): Promise<
  import("@/services/notifications/notification-mock").ReminderSettings
> {
  return isApi() ? api.getReminderSettings() : mock.getReminderSettings();
}

export async function saveReminderSettings(
  s: import("@/services/notifications/notification-mock").ReminderSettings,
): Promise<void> {
  if (isApi()) {
    await api.saveReminderSettings(s);
    return;
  }
  mock.saveReminderSettings(s);
}

export async function getNotifications(): Promise<
  import("@/services/notifications/notification-mock").AppNotification[]
> {
  return isApi() ? api.getNotifications() : mock.getNotifications();
}

export async function pushNotification(input: {
  title: string;
  body: string;
  kind: import("@/services/notifications/notification-mock").ReminderKind;
}): Promise<void> {
  if (isApi()) {
    await api.createNotification(input);
  } else {
    mock.addNotification(input);
  }
  void useNotificationStore.getState().refresh();
}

export async function markAllRead(): Promise<void> {
  if (isApi()) return api.markAllRead();
  mock.markAllRead();
}

export async function clearAllNotifications(): Promise<void> {
  if (isApi()) return api.clearAllNotifications();
  mock.clearAllNotifications();
}

export const requestBrowserPermission = isApi()
  ? api.requestBrowserPermission
  : mock.requestBrowserPermission;

export const showBrowserNotification = isApi()
  ? api.showBrowserNotification
  : mock.showBrowserNotification;

export async function checkSmartReminders(data: {
  waterMl: number;
  meals: number;
  moodSet: boolean;
  trainingMin: number;
  language?: import("@/lib/localization/languages").AppLanguage;
  userName?: string;
}): Promise<void> {
  if (isApi()) return api.checkSmartReminders(data);
  mock.checkSmartReminders(data);
}

/** Sync helper for legacy call sites — prefer async getters in API mode. */
export function getReminderSettingsSync() {
  if (isApi()) return DEFAULT_REMINDER_SETTINGS;
  return mock.getReminderSettings();
}
