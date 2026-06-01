import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  phone_verified: boolean;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyMetricsRow = {
  id: string;
  user_id: string;
  date: string;
  calories: number;
  water_ml: number;
  steps: number;
  training_minutes: number;
  sleep_hours: number;
  streak: number;
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
      };
      daily_metrics: {
        Row: DailyMetricsRow;
        Insert: Partial<DailyMetricsRow> & { user_id: string; date?: string };
        Update: Partial<DailyMetricsRow>;
      };
    };
  };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.",
    );
  }
  if (!client) {
    client = createClient<Database>(supabaseUrl(), supabaseAnonKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}
