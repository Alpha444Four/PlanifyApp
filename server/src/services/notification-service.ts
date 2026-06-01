import { getDb, newId } from "../db/index.js";
import type {
  AppNotification,
  ReminderKind,
  ReminderSettings,
} from "../types.js";
import { DEFAULT_REMINDER_SETTINGS } from "../types.js";
import { localized } from "../lib/localized-notifications.js";

type NotifRow = {
  id: string;
  title: string;
  body: string;
  kind: ReminderKind;
  read: number;
  created_at: string;
};

type SettingsRow = {
  water: number;
  meal: number;
  workout: number;
  sleep: number;
  mood: number;
  breathing: number;
  browser_push: number;
};

function rowToNotif(row: NotifRow): AppNotification {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    kind: row.kind,
    read: row.read === 1,
    createdAt: row.created_at,
  };
}

function rowToSettings(row: SettingsRow): ReminderSettings {
  return {
    water: row.water === 1,
    meal: row.meal === 1,
    workout: row.workout === 1,
    sleep: row.sleep === 1,
    mood: row.mood === 1,
    breathing: row.breathing === 1,
    browserPush: row.browser_push === 1,
  };
}

export function getNotifications(userId: string): AppNotification[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, title, body, kind, read, created_at FROM notifications
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
    )
    .all(userId) as NotifRow[];
  return rows.map(rowToNotif);
}

export function markAllRead(userId: string): void {
  getDb()
    .prepare(`UPDATE notifications SET read = 1 WHERE user_id = ?`)
    .run(userId);
}

export function clearAll(userId: string): void {
  getDb().prepare(`DELETE FROM notifications WHERE user_id = ?`).run(userId);
}

export function getReminderSettings(userId: string): ReminderSettings {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM reminder_settings WHERE user_id = ?`)
    .get(userId) as SettingsRow | undefined;
  return row ? rowToSettings(row) : DEFAULT_REMINDER_SETTINGS;
}

export function saveReminderSettings(
  userId: string,
  settings: ReminderSettings,
): ReminderSettings {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO reminder_settings (user_id, water, meal, workout, sleep, mood, breathing, browser_push, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       water = excluded.water,
       meal = excluded.meal,
       workout = excluded.workout,
       sleep = excluded.sleep,
       mood = excluded.mood,
       breathing = excluded.breathing,
       browser_push = excluded.browser_push,
       updated_at = excluded.updated_at`,
  ).run(
    userId,
    settings.water ? 1 : 0,
    settings.meal ? 1 : 0,
    settings.workout ? 1 : 0,
    settings.sleep ? 1 : 0,
    settings.mood ? 1 : 0,
    settings.breathing ? 1 : 0,
    settings.browserPush ? 1 : 0,
    now,
  );
  return settings;
}

function insertNotification(
  userId: string,
  input: {
    title: string;
    body: string;
    kind: ReminderKind;
    dedupeKey?: string;
  },
): AppNotification | null {
  const db = getDb();
  const id = newId();
  const createdAt = new Date().toISOString();
  try {
    db.prepare(
      `INSERT INTO notifications (id, user_id, title, body, kind, read, dedupe_key, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    ).run(
      id,
      userId,
      input.title,
      input.body,
      input.kind,
      input.dedupeKey ?? null,
      createdAt,
    );
  } catch {
    return null;
  }
  return {
    id,
    title: input.title,
    body: input.body,
    kind: input.kind,
    read: false,
    createdAt,
  };
}

const todayKey = () => new Date().toISOString().slice(0, 10);

export function evaluateSmartReminders(
  userId: string,
  data: {
    waterMl: number;
    meals: number;
    moodSet: boolean;
    trainingMin: number;
    language?: string;
    userName?: string;
  },
): AppNotification[] {
  const settings = getReminderSettings(userId);
  const created: AppNotification[] = [];
  const day = todayKey();
  const lang = data.language;

  if (settings.water && data.waterMl < 500) {
    const t = localized("water", lang);
    const n = insertNotification(userId, {
      title: t.title,
      body: t.body,
      kind: "water",
      dedupeKey: `water:${day}`,
    });
    if (n) created.push(n);
  }
  if (settings.meal && data.meals === 0) {
    const t = localized("meal", lang);
    const n = insertNotification(userId, {
      title: t.title,
      body: t.body,
      kind: "meal",
      dedupeKey: `meal:${day}`,
    });
    if (n) created.push(n);
  }
  if (settings.mood && !data.moodSet) {
    const t = localized("mood", lang);
    const n = insertNotification(userId, {
      title: t.title,
      body: t.body,
      kind: "mood",
      dedupeKey: `mood:${day}`,
    });
    if (n) created.push(n);
  }
  if (settings.workout && data.trainingMin === 0) {
    const t = localized("workout", lang);
    const n = insertNotification(userId, {
      title: t.title,
      body: t.body,
      kind: "workout",
      dedupeKey: `workout:${day}`,
    });
    if (n) created.push(n);
  }
  void data.userName;
  return created;
}

export function createUserNotification(
  userId: string,
  input: { title: string; body: string; kind: ReminderKind },
): AppNotification | null {
  return insertNotification(userId, {
    title: input.title,
    body: input.body,
    kind: input.kind,
  });
}

/** Server-side scheduled nudges (hourly check per user settings). */
export function runScheduledReminders(): number {
  const db = getDb();
  const day = todayKey();
  const hour = new Date().getHours();
  let count = 0;

  const users = db
    .prepare(`SELECT user_id FROM reminder_settings`)
    .all() as { user_id: string }[];

  for (const { user_id } of users) {
    const settings = getReminderSettings(user_id);
    const slots: { kind: ReminderKind; enabled: boolean; title: string; body: string; hour: number }[] = [
      { kind: "water", enabled: settings.water, hour: 10, title: "Water reminder", body: "Time for a glass of water." },
      { kind: "meal", enabled: settings.meal, hour: 12, title: "Lunch check-in", body: "Log your meal to stay on track." },
      { kind: "workout", enabled: settings.workout, hour: 17, title: "Workout reminder", body: "Schedule movement before the day ends." },
      { kind: "sleep", enabled: settings.sleep, hour: 21, title: "Wind down", body: "Start your sleep routine for better recovery." },
      { kind: "mood", enabled: settings.mood, hour: 15, title: "Mood check", body: "How is your energy this afternoon?" },
      { kind: "breathing", enabled: settings.breathing, hour: 14, title: "Breathe", body: "2 minutes of calm can reset your stress." },
    ];

    for (const slot of slots) {
      if (!slot.enabled || slot.hour !== hour) continue;
      const fired = db
        .prepare(
          `SELECT id FROM scheduled_reminder_log WHERE user_id = ? AND kind = ? AND fired_on = ?`,
        )
        .get(user_id, slot.kind, day);
      if (fired) continue;

      const n = insertNotification(user_id, {
        title: slot.title,
        body: slot.body,
        kind: slot.kind,
        dedupeKey: `sched:${slot.kind}:${day}`,
      });
      if (n) {
        db.prepare(
          `INSERT INTO scheduled_reminder_log (id, user_id, kind, fired_on) VALUES (?, ?, ?, ?)`,
        ).run(newId(), user_id, slot.kind, day);
        count++;
      }
    }
  }
  return count;
}
