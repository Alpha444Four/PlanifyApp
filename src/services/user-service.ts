import type { User } from "@/types/auth";
import { useUserDataStore } from "@/store/user-data-store";

/**
 * USER / PROFILE SERVICE — Planify (MOCK)
 * ---------------------------------------------------------------------------
 * Profile persistence + the "create a zeroed data row on first signup" seam.
 *
 * Today the profile fields live alongside the account in localStorage and the
 * per-user stats live in the user-data store. In production this maps to a
 * Supabase `profiles` table (RLS-scoped by auth.uid()):
 *   getProfile     -> select * from profiles where id = auth.uid()
 *   ensureProfile  -> insert ... on conflict do nothing (zeroed stats)
 *   updateProfile  -> update profiles set ... where id = auth.uid()
 * ---------------------------------------------------------------------------
 */

// Same store auth-service writes; kept as a local const to avoid a hard import
// cycle. Both files are the DEMO persistence layer and share this key.
const ACCOUNTS_KEY = "planify:accounts";
const SESSION_KEY = "planify:session";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type AccountRecord = User & { passwordHash: string };

function readAccounts(): AccountRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<AccountRecord[]>(localStorage.getItem(ACCOUNTS_KEY), []);
}

export function getProfile(userId: string): User | null {
  const record = readAccounts().find((a) => a.id === userId);
  if (!record) return null;
  const { passwordHash: _passwordHash, ...user } = record;
  void _passwordHash;
  return user;
}

/**
 * Creates the default per-user data row (zeroed stats) on first signup.
 * Idempotent: existing users keep their data.
 */
export function ensureProfile(user: User): void {
  useUserDataStore.getState().ensureUser(user.id);
}

export function updateProfile(
  userId: string,
  patch: Partial<Pick<User, "name" | "avatarUrl">>,
): User | null {
  if (typeof window === "undefined") return null;
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx === -1) return null;

  const updated: AccountRecord = { ...accounts[idx], ...patch };
  accounts[idx] = updated;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

  const { passwordHash: _passwordHash, ...user } = updated;
  void _passwordHash;
  // Keep the active session in sync so the UI reflects edits immediately.
  const session = safeParse<User | null>(localStorage.getItem(SESSION_KEY), null);
  if (session?.id === userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  return user;
}
