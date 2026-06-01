/**
 * AUTH SERVICE — facade
 * Priority: Supabase (production) → Express API → localStorage demo.
 */
import { isSupabaseConfigured, useRealApi } from "@/lib/env";
import * as api from "@/services/auth/auth-api";
import * as mock from "@/services/auth/auth-mock";
import * as supabase from "@/services/auth/auth-supabase";

function impl() {
  if (isSupabaseConfigured()) return supabase;
  if (useRealApi()) return api;
  return mock;
}

export function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  phone?: string,
) {
  const i = impl();
  if (isSupabaseConfigured()) {
    return supabase.signUpWithEmail(name, email, password, phone);
  }
  return i.signUpWithEmail(name, email, password);
}

export const signInWithEmail = impl().signInWithEmail;
export const signInWithGoogle = impl().signInWithGoogle;
export const signInWithApple = impl().signInWithApple;
export const signOut = impl().signOut;
export const getSession = impl().getSession;
export const sendConfirmationEmail = impl().sendConfirmationEmail;
export const verifyEmail = impl().verifyEmail;
export const verifyEmailWithToken = impl().verifyEmailWithToken;
export const sendPasswordReset = impl().sendPasswordReset;

export const updatePassword = isSupabaseConfigured()
  ? supabase.updatePassword
  : async () => ({ ok: false as const, error: "Password reset is only available with Supabase." });

export const sendPhoneOtp = isSupabaseConfigured()
  ? supabase.sendPhoneOtp
  : async () => ({ ok: false, error: "Configure Supabase for phone OTP." });

export const verifyPhoneOtp = isSupabaseConfigured()
  ? supabase.verifyPhoneOtp
  : async () => ({ ok: false, error: "Configure Supabase for phone OTP." });

export const refreshSessionFromUrl = isSupabaseConfigured()
  ? supabase.refreshSessionFromUrl
  : async () => null;

export { isSupabaseConfigured, useRealApi };
