import { getDb, newId } from "../db/index.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import {
  generateSecureToken,
  hashToken,
  signAccessToken,
} from "../lib/tokens.js";
import type { AuthProvider, PublicUser } from "../types.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./email-service.js";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  provider: AuthProvider;
  email_verified: number;
  avatar_url: string | null;
  created_at: string;
};

function rowToUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url ?? undefined,
    provider: row.provider,
    createdAt: row.created_at,
    emailVerified: row.email_verified === 1,
  };
}

function createVerificationToken(userId: string): string {
  const db = getDb();
  const raw = generateSecureToken();
  const tokenHash = hashToken(raw);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    `DELETE FROM email_verification_tokens WHERE user_id = ?`,
  ).run(userId);
  db.prepare(
    `INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(newId(), userId, tokenHash, expires, new Date().toISOString());
  return raw;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<{ user: PublicUser; accessToken: string }> {
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .get(email) as { id: string } | undefined;
  if (existing) throw new Error("EMAIL_EXISTS");

  const id = newId();
  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, provider, email_verified, created_at)
     VALUES (?, ?, ?, ?, 'email', 0, ?)`,
  ).run(id, name, email, passwordHash, createdAt);

  db.prepare(
    `INSERT INTO reminder_settings (user_id, water, meal, workout, sleep, mood, breathing, browser_push, updated_at)
     VALUES (?, 1, 1, 1, 1, 1, 1, 0, ?)`,
  ).run(id, createdAt);

  const verifyRaw = createVerificationToken(id);
  await sendVerificationEmail(email, verifyRaw);

  const user = rowToUser(
    db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as UserRow,
  );
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  return { user, accessToken };
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: PublicUser; accessToken: string }> {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM users WHERE email = ? AND provider = 'email'`)
    .get(email) as UserRow | undefined;

  if (!row?.password_hash) throw new Error("INVALID_CREDENTIALS");
  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");
  if (row.email_verified !== 1) throw new Error("EMAIL_NOT_VERIFIED");

  const user = rowToUser(row);
  return {
    user,
    accessToken: signAccessToken({ sub: user.id, email: user.email }),
  };
}

export function getUserById(id: string): PublicUser | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as
    | UserRow
    | undefined;
  return row ? rowToUser(row) : null;
}

export async function resendVerification(userId: string): Promise<void> {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId) as
    | UserRow
    | undefined;
  if (!row) throw new Error("NOT_FOUND");
  if (row.email_verified === 1) throw new Error("ALREADY_VERIFIED");
  const raw = createVerificationToken(userId);
  await sendVerificationEmail(row.email, raw);
}

export async function verifyEmailByToken(token: string): Promise<PublicUser> {
  const db = getDb();
  const tokenHash = hashToken(token);
  const record = db
    .prepare(
      `SELECT user_id, expires_at FROM email_verification_tokens WHERE token_hash = ?`,
    )
    .get(tokenHash) as { user_id: string; expires_at: string } | undefined;

  if (!record) throw new Error("INVALID_TOKEN");
  if (new Date(record.expires_at) < new Date()) throw new Error("TOKEN_EXPIRED");

  db.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(
    record.user_id,
  );
  db.prepare(`DELETE FROM email_verification_tokens WHERE user_id = ?`).run(
    record.user_id,
  );

  const user = getUserById(record.user_id);
  if (!user) throw new Error("NOT_FOUND");
  return user;
}

/** Authenticated demo confirm (same as token verify but by user id). */
export function verifyEmailByUserId(userId: string): PublicUser {
  const db = getDb();
  db.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(userId);
  db.prepare(`DELETE FROM email_verification_tokens WHERE user_id = ?`).run(
    userId,
  );
  const user = getUserById(userId);
  if (!user) throw new Error("NOT_FOUND");
  return user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  const db = getDb();
  const row = db
    .prepare(`SELECT id, email FROM users WHERE email = ? AND provider = 'email'`)
    .get(email) as { id: string; email: string } | undefined;
  if (!row) return;

  const raw = generateSecureToken();
  const tokenHash = hashToken(raw);
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  db.prepare(`DELETE FROM password_reset_tokens WHERE user_id = ?`).run(row.id);
  db.prepare(
    `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(newId(), row.id, tokenHash, expires, new Date().toISOString());
  await sendPasswordResetEmail(row.email, raw);
}

/** OAuth placeholder — creates/links user when real OAuth is wired. */
export async function oauthSignIn(
  provider: "google" | "apple",
  email: string,
  name: string,
): Promise<{ user: PublicUser; accessToken: string }> {
  const db = getDb();
  let row = db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email) as UserRow | undefined;

  if (!row) {
    const id = newId();
    const createdAt = new Date().toISOString();
    db.prepare(
      `INSERT INTO users (id, name, email, password_hash, provider, email_verified, created_at)
       VALUES (?, ?, ?, NULL, ?, 1, ?)`,
    ).run(id, name, email, provider, createdAt);
    db.prepare(
      `INSERT INTO reminder_settings (user_id, water, meal, workout, sleep, mood, breathing, browser_push, updated_at)
       VALUES (?, 1, 1, 1, 1, 1, 1, 0, ?)`,
    ).run(id, createdAt);
    row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as UserRow;
  }

  const user = rowToUser(row!);
  return {
    user,
    accessToken: signAccessToken({ sub: user.id, email: user.email }),
  };
}
