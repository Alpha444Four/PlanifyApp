# Supabase Auth setup for Planify (Vite + Vercel)

## 1. Create Supabase project

1. [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon public key**
3. Copy **service_role** key (Vercel only — never in frontend)

## 2. Run SQL migration

In Supabase → **SQL Editor**, paste and run:

`supabase/migrations/001_profiles_and_metrics.sql`

## 3. Auth settings (Supabase Dashboard)

**Authentication → URL configuration**

| Field | Value |
|-------|--------|
| Site URL | `https://your-app.vercel.app` |
| Redirect URLs | `http://localhost:5173/auth/callback`, `https://your-app.vercel.app/auth/callback`, `https://your-app.vercel.app/reset-password` |

**Authentication → Providers**

- Email: ON, **Confirm email** ON
- Google: optional (add OAuth client IDs)

**Authentication → Email templates**

Customize: Confirm signup, Reset password, Magic link

**Authentication → Phone** (for OTP)

- Enable phone provider
- Connect **Twilio** or **MessageBird** (required for SMS)

## 4. Vercel environment variables

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only (if using admin scripts) |
| `NEXT_PUBLIC_SITE_URL` | `https://planify-app-eta.vercel.app` (your domain) |
| `RESEND_API_KEY` | Optional |
| `FROM_EMAIL` | Optional, verified domain in Resend |

## 5. Flow

1. **Sign up** → Supabase sends confirmation email
2. User clicks link → `/auth/callback` → session + profile
3. **Login** → blocked until `email_confirmed_at` is set
4. **Dashboard** → metrics row created at 0 in `daily_metrics`
5. **Forgot password** → email → `/reset-password`
6. **Phone** → Profile → OTP (after SMS provider configured)

## Note on Next.js

This repo uses **Vite + React Router**, not Next.js. Route protection is in `ProtectedRoute` and `PublicOnlyRoute` (equivalent to middleware).
