import { getSupabase, type DailyMetricsRow } from "@/lib/supabase";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Ensure today's metrics row exists with zeros for a new user. */
export async function ensureTodayMetrics(userId: string): Promise<DailyMetricsRow> {
  const supabase = getSupabase();
  const date = todayKey();
  const { data: existing } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  if (existing) return existing as DailyMetricsRow;

  const { data, error } = await supabase
    .from("daily_metrics")
    .insert({
      user_id: userId,
      date,
      calories: 0,
      water_ml: 0,
      steps: 0,
      training_minutes: 0,
      sleep_hours: 0,
      streak: 0,
    } as never)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as DailyMetricsRow;
}

/** Sync Supabase metrics into local Zustand daily slice (for existing UI). */
export async function syncMetricsToUserStore(userId: string): Promise<void> {
  const row = await ensureTodayMetrics(userId);
  const { useUserDataStore } = await import("@/store/user-data-store");
  useUserDataStore.getState().patchDailyFromServer(userId, {
    waterMl: row.water_ml,
    steps: row.steps,
    trainingMinutes: row.training_minutes,
    sleepHours: Number(row.sleep_hours),
  });
}

export async function fetchTodayMetrics(userId: string): Promise<DailyMetricsRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", todayKey())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as DailyMetricsRow | null;
}
