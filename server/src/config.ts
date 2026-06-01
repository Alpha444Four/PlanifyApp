import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.SERVER_PORT ?? 8787),
  jwtSecret: required("JWT_SECRET", "dev-only-change-me-use-openssl-rand"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  databasePath:
    process.env.DATABASE_PATH ??
    path.join(__dirname, "..", "data", "planify.db"),
  isProd: process.env.NODE_ENV === "production",
  /** Log verification links to console when true (no SMTP configured). */
  devLogEmails: process.env.DEV_LOG_EMAILS !== "false",
  appPublicUrl: process.env.APP_PUBLIC_URL ?? "http://localhost:5173",
};
