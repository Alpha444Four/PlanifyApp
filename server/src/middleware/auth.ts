import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/tokens.js";
import { getUserById } from "../services/auth-service.js";
import type { PublicUser } from "../types.js";

const COOKIE_NAME = "planify_token";

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.cookies?.[COOKIE_NAME];
  if (typeof cookie === "string") return cookie;
  return null;
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export interface AuthedRequest extends Request {
  user?: PublicUser;
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({ ok: false, error: "Invalid or expired session" });
    return;
  }
  const user = getUserById(payload.sub);
  if (!user) {
    res.status(401).json({ ok: false, error: "User not found" });
    return;
  }
  req.user = user;
  next();
}
