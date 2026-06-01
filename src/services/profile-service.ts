import { getSupabase, type ProfileRow } from "@/lib/supabase";
import type { User } from "@/types/auth";
import type { AuthProvider } from "@/types/auth";

export function profileToUser(
  profile: ProfileRow,
  auth: {
    email: string;
    emailVerified: boolean;
    provider: AuthProvider;
    createdAt: string;
  },
): User {
  return {
    id: profile.id,
    name: profile.full_name ?? auth.email.split("@")[0] ?? "User",
    email: profile.email ?? auth.email,
    phone: profile.phone ?? undefined,
    phoneVerified: profile.phone_verified,
    avatarUrl: profile.avatar_url ?? undefined,
    provider: auth.provider,
    createdAt: profile.created_at ?? auth.createdAt,
    emailVerified: auth.emailVerified,
    onboardingCompleted: profile.onboarding_completed,
  };
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as ProfileRow | null;
}

export async function upsertProfile(
  userId: string,
  patch: Partial<
    Pick<ProfileRow, "full_name" | "email" | "phone" | "avatar_url" | "phone_verified" | "onboarding_completed">
  >,
): Promise<ProfileRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() } as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as ProfileRow;
}

export async function updateProfileFields(
  userId: string,
  patch: Partial<Pick<ProfileRow, "full_name" | "phone" | "avatar_url" | "phone_verified" | "onboarding_completed">>,
): Promise<ProfileRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .update(patch as never)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as ProfileRow;
}
