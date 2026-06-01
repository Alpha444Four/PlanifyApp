/**
 * Auth domain types — Planify
 * ---------------------------------------------------------------------------
 * These types describe the authenticated user as the rest of the app sees it.
 * They are provider-agnostic on purpose: today they are populated by the MOCK
 * auth service (`src/services/auth-service.ts`), but the same shape maps cleanly
 * onto a real Supabase `auth.users` row + `profiles` table later.
 *
 * Supabase mapping (future):
 *   auth.users.id            -> User.id
 *   auth.users.email         -> User.email
 *   profiles.full_name       -> User.name
 *   profiles.avatar_url      -> User.avatarUrl
 *   auth.users.app_metadata.provider -> User.provider
 *   auth.users.created_at    -> User.createdAt
 * ---------------------------------------------------------------------------
 */

export type AuthProvider = "email" | "google" | "apple";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  /** Email/password accounts must verify before full dashboard access. OAuth is auto-verified. */
  emailVerified: boolean;
  onboardingCompleted?: boolean;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** Discriminated result returned by every auth-service call. */
export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };
