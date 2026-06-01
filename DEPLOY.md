# Deploy Planify to Vercel

## Why builds fail with `TS18003: No inputs were found`

Your GitHub repo must include the **`src/`** folder (all `.tsx` / `.ts` app code).  
If only `package.json`, `index.html`, and tsconfig are pushed, Vercel has nothing to compile.

Check: https://github.com/Alpha444Four/PlanifyApp — you should see a **`src`** directory.

## Push the full project (run from this folder)

```bash
git add src public server vercel.json .env.example package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html postcss.config.js tailwind.config.js README.md .gitignore
git status
git commit -m "Add app source and Vercel config for deployment"
git push origin main
```

**Do not commit `.env`** (secrets). If `.env` is already on GitHub, remove it:

```bash
git rm --cached .env
echo .env>>.gitignore
git commit -m "Stop tracking .env"
git push origin main
```

Then rotate `JWT_SECRET` and any API keys.

## Vercel settings

| Setting | Value |
|---------|--------|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install --ignore-scripts` |

## Environment variables (Vercel dashboard)

| Variable | Value |
|----------|--------|
| `VITE_USE_REAL_API` | `false` (demo mode on static hosting) |
| `VITE_API_BASE_URL` | *(empty)* |
| `VITE_APP_NAME` | `Planify` |

## Verify before push

```bash
npm install
npm run build
```
