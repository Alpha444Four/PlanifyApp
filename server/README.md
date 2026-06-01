# Planify API

Express + SQLite backend for **authentication** and **notifications**.

## Run

From project root (with `.env` configured):

```bash
npm run dev:server
```

Or together with the Vite app:

```bash
npm run dev:all
```

Health check: `GET http://localhost:8787/api/health`

## Auth endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register (bcrypt password, verification email logged in dev) |
| POST | `/api/auth/login` | Login → httpOnly JWT cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user (requires auth) |
| POST | `/api/auth/verify-email` | Body: `{ token }` from email link |
| POST | `/api/auth/verify-email/confirm` | Confirm while logged in (dev button) |
| POST | `/api/auth/resend-verification` | Resend verification |
| POST | `/api/auth/forgot-password` | Password reset email (dev log) |
| POST | `/api/auth/oauth/google` | Stub OAuth user |
| POST | `/api/auth/oauth/apple` | Stub OAuth user |

## Notification endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications` | List user notifications |
| PATCH | `/api/notifications/read-all` | Mark all read |
| DELETE | `/api/notifications` | Clear all |
| GET | `/api/notifications/settings` | Reminder toggles |
| PUT | `/api/notifications/settings` | Save toggles |
| POST | `/api/notifications/evaluate` | Smart reminders from dashboard stats |

Scheduled hourly reminders run in-process when the server is up.

## Security

- bcrypt (12 rounds) for passwords
- JWT in httpOnly cookie (`planify_token`)
- Rate limiting on auth routes
- Helmet + CORS with credentials
- Zod validation on inputs
- Email enumeration avoided on forgot-password
