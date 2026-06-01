import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  verifyTokenSchema,
} from "../lib/validation.js";
import {
  clearAuthCookie,
  requireAuth,
  setAuthCookie,
  type AuthedRequest,
} from "../middleware/auth.js";
import * as auth from "../services/auth-service.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many attempts. Try again later." },
});

export const authRouter = Router();

authRouter.use(authLimiter);

authRouter.post("/signup", async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.errors[0]?.message });
    return;
  }
  try {
    const { user, accessToken } = await auth.signUp(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
    );
    setAuthCookie(res, accessToken);
    res.status(201).json({ ok: true, user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Signup failed";
    if (msg === "EMAIL_EXISTS") {
      res.status(409).json({ ok: false, error: "Email already exists" });
      return;
    }
    res.status(500).json({ ok: false, error: "Signup failed" });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.errors[0]?.message });
    return;
  }
  try {
    const { user, accessToken } = await auth.signIn(
      parsed.data.email,
      parsed.data.password,
    );
    setAuthCookie(res, accessToken);
    res.json({ ok: true, user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_NOT_VERIFIED") {
      res.status(403).json({
        ok: false,
        error:
          "Please confirm your email before signing in. Check your inbox or resend the link.",
      });
      return;
    }
    res.status(401).json({ ok: false, error: "Invalid email or password" });
  }
});

authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ ok: true, user: req.user });
});

authRouter.post("/verify-email", async (req, res) => {
  const parsed = verifyTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid verification token" });
    return;
  }
  try {
    const user = await auth.verifyEmailByToken(parsed.data.token);
    res.json({ ok: true, user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "TOKEN_EXPIRED") {
      res.status(410).json({ ok: false, error: "Verification link expired." });
      return;
    }
    res.status(400).json({ ok: false, error: "Invalid verification link." });
  }
});

authRouter.post("/verify-email/confirm", requireAuth, (req: AuthedRequest, res) => {
  try {
    const user = auth.verifyEmailByUserId(req.user!.id);
    res.json({ ok: true, user });
  } catch {
    res.status(400).json({ ok: false, error: "Could not verify email." });
  }
});

authRouter.post("/resend-verification", requireAuth, async (req: AuthedRequest, res) => {
  try {
    await auth.resendVerification(req.user!.id);
    res.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "ALREADY_VERIFIED") {
      res.json({ ok: true });
      return;
    }
    res.status(400).json({ ok: false, error: "Could not resend email." });
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.errors[0]?.message });
    return;
  }
  await auth.requestPasswordReset(parsed.data.email);
  res.json({
    ok: true,
    message: "If that email exists, we sent reset instructions.",
  });
});

authRouter.post("/oauth/google", async (_req, res) => {
  try {
    const { user, accessToken } = await auth.oauthSignIn(
      "google",
      "google.user@planify.app",
      "Google User",
    );
    setAuthCookie(res, accessToken);
    res.json({ ok: true, user });
  } catch {
    res.status(500).json({ ok: false, error: "OAuth sign-in failed" });
  }
});

authRouter.post("/oauth/apple", async (_req, res) => {
  try {
    const { user, accessToken } = await auth.oauthSignIn(
      "apple",
      "apple.user@planify.app",
      "Apple User",
    );
    setAuthCookie(res, accessToken);
    res.json({ ok: true, user });
  } catch {
    res.status(500).json({ ok: false, error: "OAuth sign-in failed" });
  }
});
