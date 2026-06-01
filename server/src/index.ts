import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { getDb } from "./db/index.js";
import { authRouter } from "./routes/auth.js";
import { notificationsRouter } from "./routes/notifications.js";
import { runScheduledReminders } from "./services/notification-service.js";

getDb();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "planify-api", version: "1.0.0" });
});

app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationsRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[api]", err.message);
    res.status(500).json({ ok: false, error: "Internal server error" });
  },
);

const SCHEDULE_MS = 60 * 60 * 1000;
setInterval(() => {
  const n = runScheduledReminders();
  if (n > 0) console.log(`[Planify] Scheduled ${n} reminder(s)`);
}, SCHEDULE_MS);

app.listen(config.port, () => {
  console.log(`Planify API http://localhost:${config.port}`);
  console.log(`  CORS: ${config.corsOrigin}`);
  console.log(`  DB:   ${config.databasePath}`);
});
