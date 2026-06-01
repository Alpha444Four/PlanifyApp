import type { User } from "@/types/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { updateProfileFields } from "@/services/profile-service";
import { useUserDataStore } from "@/store/user-data-store";

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

export function ensureProfile(user: User): void {
  useUserDataStore.getState().ensureUser(user.id);
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<User, "name" | "avatarUrl" | "phone" | "phoneVerified">>,
): Promise<User | null> {
  if (isSupabaseConfigured()) {
    const row = await updateProfileFields(userId, {
      full_name: patch.name,
      avatar_url: patch.avatarUrl,
      phone: patch.phone,
      phone_verified: patch.phoneVerified,
    });
    return {
      id: row.id,
      name: row.full_name ?? "",
      email: row.email ?? "",
      phone: row.phone ?? undefined,
      phoneVerified: row.phone_verified,
      avatarUrl: row.avatar_url ?? undefined,
      provider: "email",
      createdAt: row.created_at,
      emailVerified: true,
      onboardingCompleted: row.onboarding_completed,
    };
  }

  if (typeof window === "undefined") return null;
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === userId);
  if (idx === -1) return null;

  const updated: AccountRecord = { ...accounts[idx], ...patch };
  accounts[idx] = updated;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

  const { passwordHash: _passwordHash, ...user } = updated;
  void _passwordHash;
  const session = safeParse<User | null>(localStorage.getItem(SESSION_KEY), null);
  if (session?.id === userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  return user;
}
