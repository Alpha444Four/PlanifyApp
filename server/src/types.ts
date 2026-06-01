export type AuthProvider = "email" | "google" | "apple";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  emailVerified: boolean;
}

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

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  water: true,
  meal: true,
  workout: true,
  sleep: true,
  mood: true,
  breathing: true,
  browserPush: false,
};
