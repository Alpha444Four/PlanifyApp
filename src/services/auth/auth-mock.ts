import type { AuthResult, AuthProvider, User } from "@/types/auth";

/** DEMO-ONLY — localStorage auth. Use VITE_USE_REAL_API=true for the Express API. */

const ACCOUNTS_KEY = "planify:accounts";
const SESSION_KEY = "planify:session";
const SIMULATED_LATENCY = 650;

interface AccountRecord extends User {
  passwordHash: string;
}

function delay(ms = SIMULATED_LATENCY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uid(): string {
  return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function obfuscate(password: string): string {
  try {
    return btoa(unescape(encodeURIComponent(`planify::${password}`)));
  } catch {
    return password;
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readAccounts(): AccountRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<AccountRecord[]>(localStorage.getItem(ACCOUNTS_KEY), []);
}

function writeAccounts(accounts: AccountRecord[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toUser(record: AccountRecord): User {
  const { passwordHash: _h, emailVerified: ev, ...rest } = record;
  void _h;
  return { ...rest, emailVerified: ev ?? rest.provider !== "email" };
}

function persistSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  await delay();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  if (!cleanName) return { ok: false, error: "Please enter your name." };
  if (!isValidEmail(cleanEmail))
    return { ok: false, error: "Please enter a valid email address." };
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  if (readAccounts().some((a) => a.email === cleanEmail))
    return { ok: false, error: "Email already exists" };

  const record: AccountRecord = {
    id: uid(),
    name: cleanName,
    email: cleanEmail,
    provider: "email",
    createdAt: new Date().toISOString(),
    passwordHash: obfuscate(password),
    emailVerified: false,
  };
  writeAccounts([...readAccounts(), record]);
  const user = toUser(record);
  persistSession(user);
  return { ok: true, user };
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  await delay();
  const record = readAccounts().find((a) => a.email === email.trim().toLowerCase());
  if (!record || record.passwordHash !== obfuscate(password))
    return { ok: false, error: "Invalid email or password" };
  const user = toUser(record);
  if (!user.emailVerified)
    return {
      ok: false,
      error:
        "Please confirm your email before signing in. Check your inbox or resend the link.",
    };
  persistSession(user);
  return { ok: true, user };
}

async function simulateOAuth(provider: Exclude<AuthProvider, "email">): Promise<AuthResult> {
  await delay(900);
  const cleanEmail = `${provider}.user@planify.app`;
  const accounts = readAccounts();
  let record = accounts.find((a) => a.email === cleanEmail);
  if (!record) {
    record = {
      id: uid(),
      name: `${provider === "google" ? "Google" : "Apple"} User`,
      email: cleanEmail,
      provider,
      createdAt: new Date().toISOString(),
      passwordHash: obfuscate(`oauth::${provider}`),
      emailVerified: true,
    };
    writeAccounts([...accounts, record]);
  }
  const user = toUser(record);
  persistSession(user);
  return { ok: true, user };
}

export const signInWithGoogle = () => simulateOAuth("google");
export const signInWithApple = () => simulateOAuth("apple");

export async function signOut(): Promise<void> {
  await delay(250);
  localStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const user = safeParse<User | null>(localStorage.getItem(SESSION_KEY), null);
  if (!user) return null;
  return { ...user, emailVerified: user.emailVerified ?? user.provider !== "email" };
}

export async function sendConfirmationEmail(email: string): Promise<AuthResult> {
  await delay(500);
  if (!isValidEmail(email.trim()))
    return { ok: false, error: "Invalid email address." };
  return {
    ok: true,
    user: {
      id: "confirm",
      name: "",
      email: email.trim().toLowerCase(),
      provider: "email",
      createdAt: new Date().toISOString(),
      emailVerified: false,
    },
  };
}

export async function verifyEmail(userId: string): Promise<AuthResult> {
  await delay(600);
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx === -1) return { ok: false, error: "Account not found." };
  accounts[idx] = { ...accounts[idx], emailVerified: true };
  writeAccounts(accounts);
  const user = toUser(accounts[idx]);
  persistSession(user);
  return { ok: true, user };
}

export async function verifyEmailWithToken(_token: string): Promise<AuthResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sign in required." };
  return verifyEmail(session.id);
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  await delay();
  if (!isValidEmail(email.trim()))
    return { ok: false, error: "Please enter a valid email address." };
  return {
    ok: true,
    user: {
      id: "reset",
      name: "",
      email: email.trim().toLowerCase(),
      provider: "email",
      createdAt: new Date().toISOString(),
      emailVerified: false,
    },
  };
}
