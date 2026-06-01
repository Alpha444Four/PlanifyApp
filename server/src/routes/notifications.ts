import { Router } from "express";
import {
  evaluateRemindersSchema,
  reminderSettingsSchema,
} from "../lib/validation.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import * as notifications from "../services/notification-service.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", (req: AuthedRequest, res) => {
  const list = notifications.getNotifications(req.user!.id);
  res.json({ ok: true, notifications: list });
});

notificationsRouter.post("/", (req: AuthedRequest, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
  const kind = req.body?.kind as string;
  const allowed = ["water", "meal", "workout", "sleep", "mood", "breathing", "task"];
  if (!title || !body || !allowed.includes(kind)) {
    res.status(400).json({ ok: false, error: "Invalid notification" });
    return;
  }
  const created = notifications.createUserNotification(req.user!.id, {
    title,
    body,
    kind: kind as import("../types.js").ReminderKind,
  });
  if (!created) {
    res.status(500).json({ ok: false, error: "Could not create notification" });
    return;
  }
  res.status(201).json({ ok: true, notification: created });
});

notificationsRouter.patch("/read-all", (req: AuthedRequest, res) => {
  notifications.markAllRead(req.user!.id);
  res.json({ ok: true });
});

notificationsRouter.delete("/", (req: AuthedRequest, res) => {
  notifications.clearAll(req.user!.id);
  res.json({ ok: true });
});

notificationsRouter.get("/settings", (req: AuthedRequest, res) => {
  res.json({
    ok: true,
    settings: notifications.getReminderSettings(req.user!.id),
  });
});

notificationsRouter.put("/settings", (req: AuthedRequest, res) => {
  const parsed = reminderSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid settings" });
    return;
  }
  const saved = notifications.saveReminderSettings(
    req.user!.id,
    parsed.data,
  );
  res.json({ ok: true, settings: saved });
});

notificationsRouter.post("/evaluate", (req: AuthedRequest, res) => {
  const parsed = evaluateRemindersSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid payload" });
    return;
  }
  const created = notifications.evaluateSmartReminders(
    req.user!.id,
    parsed.data,
  );
  res.json({ ok: true, created });
});
