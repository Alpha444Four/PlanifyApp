/** Use Express API when true; otherwise localStorage mock services. */
export function useRealApi(): boolean {
  return import.meta.env.VITE_USE_REAL_API === "true";
}

/** Empty string = same-origin `/api` (Vite proxy in dev). */
export function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  return base.replace(/\/$/, "");
}
