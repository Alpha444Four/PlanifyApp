# Planify

> Premium AI health companion — habits, food, training, sleep, water, mood and gamification in one mobile-first dashboard.

**Stack:** Vite 5 · React 18 · TypeScript · Tailwind CSS · Framer Motion · Zustand · React Router · Recharts

---

## Run locally

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev:all        # Vite + API (recommended)
# or separately:
npm run dev:server     # API http://localhost:8787
npm run dev            # App http://localhost:5173
```

Set `VITE_USE_REAL_API=true` in `.env` for **real login/signup/notifications** (Express + SQLite).  
Set `VITE_USE_REAL_API=false` for offline demo mode (localStorage only).

Copy `.env.example` → `.env`. Only `VITE_*` vars are exposed to the browser; **JWT_SECRET** and DB paths stay server-side.

---

## What's included

### Design & shell
- Black/white theme with **blue + yellow** accents, light/dark/system toggle
- Collapsible desktop sidebar + mobile drawer
- Framer Motion page transitions, animated counters, glassmorphism (dark)
- shadcn-style UI primitives + 21st.dev-inspired cards (`SleepTrackerCard`, `WorkoutCard`)

### Auth (Express API or mock)
- **API mode:** bcrypt passwords, JWT httpOnly cookies, SQLite users, email verification tokens (logged to terminal in dev), rate limiting
- **Mock mode:** localStorage demo auth (no server)
- Sign up / login / forgot password / logout
- Google & Apple OAuth (API stubs; wire real OAuth later)
- Email verification before dashboard (`/verify-email`)
- Protected `/app/*` routes, per-user data (starts at **zero**)

See [server/README.md](server/README.md) for API routes.

### Wellness features
| Route | Feature |
|-------|---------|
| `/app` | Dashboard — stats, AI coach tip, daily challenges, empty states |
| `/app/food-scan` | AI food scanner (mock vision) → log macros |
| `/app/chat` | AI coach chat (reads today's stats) |
| `/app/training` | Workout classes + completion |
| `/app/sleep`, `/water`, `/steps`, `/mood`, `/relax` | Trackers + breathing timer |
| `/app/awards` | Medals (Bronze → Diamond) + achievements |
| `/app/notifications` | Server-backed reminder inbox (API mode) |
| `/app/profile` | Avatar presets/upload, goals, fitness level |
| `/app/settings` | Theme + reminder toggles + browser notifications |

### Services (`src/services/`)
`auth-service`, `user-service`, `dashboard-service`, `food-scanner-service`, `ai-coach-service`, `awards-service`, `notification-service` — swap implementations for Supabase / real APIs without changing UI.

### Data
- `user-data-store` (persisted per user id): meals, macros, water, sleep, mood, challenges, achievements
- Mock AI works **without API keys**; TODO comments mark real OpenAI/Vision/push integration points

---

## Deploy on Vercel (public link)

This repo is **Vite + React** (not Next.js). Vercel serves the static `dist` folder.

| Setting | Value |
|--------|--------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install --ignore-scripts` (see `vercel.json`) |
| Node.js Version | 18.x or 20.x |

### Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Production value |
|----------|------------------|
| `VITE_USE_REAL_API` | `false` for demo (localStorage auth), or `true` if you deploy the API separately |
| `VITE_API_BASE_URL` | Empty on Vercel demo. If using a remote API: `https://your-api-host.com` (no trailing slash) |
| `VITE_APP_NAME` | `Planify` (optional) |

The **Express + SQLite API** in `server/` does not run on Vercel static hosting. For full auth/notifications in production, deploy `server/` to Railway/Render/Fly and set `VITE_API_BASE_URL` + `VITE_USE_REAL_API=true`.

### Commands before deploy

```bash
npm install
npm run build
```

`vercel.json` includes SPA rewrites so `/app/*` routes work in Chrome.

---

## Project structure

```
src/
├─ components/   ui, layout, shared, widgets
├─ pages/        routes (landing, auth, app)
├─ services/     backend-ready service layer
├─ store/        auth-store, user-data-store, ui-store
├─ types/        auth, data, health, profile
├─ config/       navigation.ts
└─ lib/          motion, mock-data, utils
```

---

## Production integration checklist

1. **Supabase Auth** — replace `auth-service.ts` (see file header comments)
2. **Database** — `profiles`, `daily_stats`, `meals`, `mood_logs`, etc. (types in `src/types/`)
3. **AI** — server routes for `food-scanner-service` + `ai-coach-service` streaming
4. **Push** — extend `notification-service.ts` with FCM/web push
5. **Food vision** — OpenAI Vision / custom model behind `analyzeFoodImage()`

---

## Demo flow

1. Landing → **Get Started** → Sign up
2. Confirm email on `/verify-email` (demo button)
3. Dashboard shows **zero stats** and premium empty states
4. Log water / scan food / set mood → counters and challenges update
5. Optional: **Load sample data** in Settings for a full preview

---

Built as a serious SaaS-quality front end — ready for backend wiring, not a throwaway prototype.
