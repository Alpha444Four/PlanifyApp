/**
 * SUPABASE AUTH — production auth for Planify (Vite + Vercel).
 *
 * Phone OTP requires Supabase Dashboard → Auth → Phone → Twilio/MessageBird.
 * Env (server): none on client for SMS; configure provider in Supabase only.
 *
 * Email: Supabase built-in templates for confirm + reset.
 * Optional Resend extras via /api/send-email (welcome, security alert).
 */
import type { AuthProvider, AuthResult, User } from "@/types/auth";
import { siteUrl } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import {
  fetchProfile,
  profileToUser,
  upsertProfile,
  updateProfileFields,
} from "@/services/profile-service";
import { ensureTodayMetrics } from "@/services/metrics-service";

function authCallbackUrl(): string {
  return `${siteUrl()}/auth/callback`;
}

function resetPasswordUrl(): string {
  return `${siteUrl()}/reset-password`;
}

function providerFromUser(
  appMeta: Record<string, unknown> | undefined,
): AuthProvider {
  const p = appMeta?.provider;
  if (p === "google") return "google";
  if (p === "apple") return "apple";
  return "email";
}

async function mapSessionUser(): Promise<User | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const su = session.user;
  let profile = await fetchProfile(su.id);
  if (!profile) {
    profile = await upsertProfile(su.id, {
      full_name: (su.user_metadata?.full_name as string) ?? undefined,
      email: su.email ?? undefined,
      phone: (su.user_metadata?.phone as string) ?? undefined,
    });
  }

  return profileToUser(profile, {
    email: su.email ?? "",
    emailVerified: Boolean(su.email_confirmed_at),
    provider: providerFromUser(su.app_metadata as Record<string, unknown>),
    createdAt: su.created_at,
  });
}

async function afterAuth(user: User): Promise<void> {
  if (user.emailVerified) {
    await ensureTodayMetrics(user.id);
    await sendTransactionalEmail("welcome", user.email, user.name);
  }
}

async function sendTransactionalEmail(
  type: "welcome" | "security" | "confirm",
  email: string,
  name?: string,
): Promise<void> {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, email, name }),
    });
  } catch {
    /* Resend optional — Supabase handles confirm/reset */
  }
}

export async function getSession(): Promise<User | null> {
  try {
    return await mapSessionUser();
  } catch {
    return null;
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<AuthResult> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, phone: phone ?? null },
      emailRedirectTo: authCallbackUrl(),
    },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "Sign up failed." };

  await upsertProfile(data.user.id, {
    full_name: name,
    email,
    phone: phone ?? null,
  });

  const emailVerified = Boolean(data.user.email_confirmed_at);
  const user = profileToUser(
    (await fetchProfile(data.user.id))!,
    {
      email,
      emailVerified,
      provider: "email",
      createdAt: data.user.created_at,
    },
  );

  if (emailVerified) await afterAuth(user);

  return { ok: true, user };
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { ok: false, error: "Please confirm your email before signing in." };
    }
    return { ok: false, error: error.message };
  }

  const user = await mapSessionUser();
  if (!user) return { ok: false, error: "Session error." };

  if (!user.emailVerified) {
    return { ok: false, error: "Please confirm your email before signing in." };
  }

  await afterAuth(user);
  await sendTransactionalEmail("security", user.email, user.name);
  return { ok: true, user };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authCallbackUrl() },
  });
  if (error) return { ok: false, error: error.message };
  const user = await mapSessionUser();
  if (!user) {
    return { ok: true, user: { id: "", name: "", email: "", provider: "google", createdAt: "", emailVerified: true } };
  }
  return { ok: true, user };
}

export async function signInWithApple(): Promise<AuthResult> {
  return { ok: false, error: "Apple Sign-In: enable Apple provider in Supabase Auth." };
}

export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut();
}

export async function sendConfirmationEmail(email: string): Promise<AuthResult> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: authCallbackUrl() },
  });
  if (error) return { ok: false, error: error.message };
  const sessionUser = await mapSessionUser();
  if (sessionUser) return { ok: true, user: sessionUser };
  return {
    ok: true,
    user: {
      id: "pending",
      name: email.split("@")[0] ?? "",
      email,
      provider: "email",
      createdAt: new Date().toISOString(),
      emailVerified: false,
    },
  };
}

export async function verifyEmail(_userId: string): Promise<AuthResult> {
  const user = await mapSessionUser();
  if (!user) return { ok: false, error: "Not signed in." };
  if (!user.emailVerified) {
    return { ok: false, error: "Email not verified yet. Check your inbox." };
  }
  await afterAuth(user);
  return { ok: true, user };
}

export async function verifyEmailWithToken(_token: string): Promise<AuthResult> {
  const user = await mapSessionUser();
  if (!user) return { ok: false, error: "Invalid or expired link." };
  if (!user.emailVerified) return { ok: false, error: "Email not verified yet." };
  await afterAuth(user);
  return { ok: true, user };
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetPasswordUrl(),
  });
  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    user: { id: "", name: "", email, provider: "email", createdAt: "", emailVerified: false },
  };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  const user = await mapSessionUser();
  if (!user) return { ok: false, error: "Session expired." };
  return { ok: true, user };
}

/** Phone OTP — requires Twilio/MessageBird in Supabase Auth settings. */
export async function sendPhoneOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  const normalized = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;
  const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function verifyPhoneOtp(
  phone: string,
  token: string,
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  const normalized = phone.startsWith("+") ? phone : `+${phone.replace(/\D/g, "")}`;
  const { error } = await supabase.auth.verifyOtp({
    phone: normalized,
    token,
    type: "sms",
  });
  if (error) return { ok: false, error: error.message };

  await updateProfileFields(userId, { phone: normalized, phone_verified: true });
  return { ok: true };
}

export async function refreshSessionFromUrl(): Promise<User | null> {
  const supabase = getSupabase();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  return mapSessionUser();
}
