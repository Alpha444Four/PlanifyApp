import { ApiError, apiGet, apiPost } from "@/lib/api-client";
import type { AuthResult, User } from "@/types/auth";

type UserResponse = { ok: true; user: User };

function toResult<T extends AuthResult>(
  fn: () => Promise<T>,
): Promise<AuthResult> {
  return fn().catch((e) => {
    if (e instanceof ApiError) return { ok: false, error: e.message };
    return { ok: false, error: "Something went wrong. Try again." };
  });
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/signup", {
      name,
      email,
      password,
    });
    return { ok: true, user: res.user };
  });
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/login", { email, password });
    return { ok: true, user: res.user };
  });
}

export async function signInWithGoogle(): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/oauth/google");
    return { ok: true, user: res.user };
  });
}

export async function signInWithApple(): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/oauth/apple");
    return { ok: true, user: res.user };
  });
}

export async function signOut(): Promise<void> {
  await apiPost("/api/auth/logout");
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await apiGet<UserResponse>("/api/auth/me");
    return res.user;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    return null;
  }
}

export async function sendConfirmationEmail(_email: string): Promise<AuthResult> {
  return toResult(async () => {
    await apiPost("/api/auth/resend-verification");
    const user = await getSession();
    if (!user) return { ok: false, error: "Not signed in." };
    return { ok: true, user };
  });
}

export async function verifyEmail(userId: string): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/verify-email/confirm");
    if (res.user.id !== userId) return { ok: true, user: res.user };
    return { ok: true, user: res.user };
  });
}

export async function verifyEmailWithToken(token: string): Promise<AuthResult> {
  return toResult(async () => {
    const res = await apiPost<UserResponse>("/api/auth/verify-email", { token });
    return { ok: true, user: res.user };
  });
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  return toResult(async () => {
    await apiPost("/api/auth/forgot-password", { email });
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
  });
}
