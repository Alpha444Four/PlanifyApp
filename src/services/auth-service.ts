/**
 * AUTH SERVICE — facade
 * Set VITE_USE_REAL_API=true to use the Express + SQLite backend.
 * Default: localStorage mock (offline demo).
 */
import { useRealApi } from "@/lib/env";
import * as api from "@/services/auth/auth-api";
import * as mock from "@/services/auth/auth-mock";

const impl = useRealApi() ? api : mock;

export const signUpWithEmail = impl.signUpWithEmail;
export const signInWithEmail = impl.signInWithEmail;
export const signInWithGoogle = impl.signInWithGoogle;
export const signInWithApple = impl.signInWithApple;
export const signOut = impl.signOut;
export const getSession = impl.getSession;
export const sendConfirmationEmail = impl.sendConfirmationEmail;
export const verifyEmail = impl.verifyEmail;
export const verifyEmailWithToken = impl.verifyEmailWithToken;
export const sendPasswordReset = impl.sendPasswordReset;

export { useRealApi };
