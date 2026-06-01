/** Use Express API when true (legacy); Supabase takes priority when configured. */
export function useRealApi(): boolean {
  return import.meta.env.VITE_USE_REAL_API === "true";
}

/** Supabase Auth + Postgres (production). */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function supabaseUrl(): string {
  return (
    import.meta.env.VITE_SUPABASE_URL ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).trim();
}

export function supabaseAnonKey(): string {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();
}

/** Public site URL for auth redirects (Vercel or local). */
export function siteUrl(): string {
  const url =
    import.meta.env.VITE_SITE_URL ??
    import.meta.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return url.replace(/\/$/, "");
}

/** Empty string = same-origin `/api` (Vite proxy in dev). */
export function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  return base.replace(/\/$/, "");
}
