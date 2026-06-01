import { create } from "zustand";
import type { AuthStatus, User } from "@/types/auth";
import * as authService from "@/services/auth-service";
import { ensureProfile } from "@/services/user-service";
import { useNotificationStore } from "@/store/notification-store";
import { useUserDataStore } from "@/store/user-data-store";

/**
 * AUTH STORE — Planify
 * ---------------------------------------------------------------------------
 * Holds the authenticated user + status and orchestrates the auth-service.
 *
 * Persistence is owned by the auth-service (localStorage session + accounts),
 * so this store stays a thin in-memory orchestrator and is rehydrated on mount
 * via `initialize()` (which calls authService.getSession()). This avoids a
 * double source of truth that could desync on reload.
 *
 * On every successful auth we point the user-data store at the user id so all
 * dashboard data is isolated per account.
 * ---------------------------------------------------------------------------
 */

interface AuthState {
  user: User | null;
  status: AuthStatus;
  /** Rehydrate session on app mount. */
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signInWithApple: () => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  verifyEmail: (token?: string) => Promise<{ ok: boolean; error?: string }>;
  resendConfirmation: () => Promise<{ ok: boolean; error?: string }>;
  setUser: (user: User) => void;
}

/** Activate a user's isolated data slice after auth. */
function activate(user: User): void {
  ensureProfile(user);
  useUserDataStore.getState().setActiveUser(user.id);
  void useNotificationStore.getState().refresh();
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",

  initialize: async () => {
    try {
      const user = await authService.getSession();
      if (user) {
        activate(user);
        set({ user, status: "authenticated" });
      } else {
        useUserDataStore.getState().setActiveUser(null);
        set({ user: null, status: "unauthenticated" });
      }
    } catch {
      // Expired / corrupt session -> treat as logged out.
      set({ user: null, status: "unauthenticated" });
    }
  },

  signIn: async (email, password) => {
    const result = await authService.signInWithEmail(email, password);
    if (!result.ok) return { ok: false, error: result.error };
    activate(result.user);
    set({ user: result.user, status: "authenticated" });
    return { ok: true };
  },

  signUp: async (name, email, password) => {
    const result = await authService.signUpWithEmail(name, email, password);
    if (!result.ok) return { ok: false, error: result.error };
    activate(result.user);
    set({ user: result.user, status: "authenticated" });
    return { ok: true };
  },

  signInWithGoogle: async () => {
    const result = await authService.signInWithGoogle();
    if (!result.ok) return { ok: false, error: result.error };
    activate(result.user);
    set({ user: result.user, status: "authenticated" });
    return { ok: true };
  },

  signInWithApple: async () => {
    const result = await authService.signInWithApple();
    if (!result.ok) return { ok: false, error: result.error };
    activate(result.user);
    set({ user: result.user, status: "authenticated" });
    return { ok: true };
  },

  signOut: async () => {
    await authService.signOut();
    useUserDataStore.getState().setActiveUser(null);
    useNotificationStore.setState({ items: [], unreadCount: 0 });
    set({ user: null, status: "unauthenticated" });
  },

  verifyEmail: async (
    token?: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const current = useAuthStore.getState().user;
    let result: Awaited<ReturnType<typeof authService.verifyEmail>>;
    if (token) {
      result = await authService.verifyEmailWithToken(token);
    } else if (current) {
      result = await authService.verifyEmail(current.id);
    } else {
      return { ok: false, error: "Not signed in." };
    }
    if (!result.ok) return { ok: false, error: result.error };
    activate(result.user);
    set({ user: result.user, status: "authenticated" });
    return { ok: true };
  },

  resendConfirmation: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.email) return { ok: false, error: "No email on file." };
    const result = await authService.sendConfirmationEmail(user.email);
    return result.ok ? { ok: true } : { ok: false, error: result.error };
  },

  setUser: (user) => set({ user }),
}));

/** Convenience hook mirroring a typical `useAuth()` API. */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithApple = useAuthStore((s) => s.signInWithApple);
  const signOut = useAuthStore((s) => s.signOut);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendConfirmation = useAuthStore((s) => s.resendConfirmation);
  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    verifyEmail,
    resendConfirmation,
  };
}
