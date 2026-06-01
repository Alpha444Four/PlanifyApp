-- Planify: profiles + daily_metrics with RLS
-- Run in Supabase SQL Editor or via Supabase CLI

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  phone_verified boolean not null default false,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Daily metrics per user (zeroed on first row)
create table if not exists public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null default (timezone('utc', now()))::date,
  calories integer not null default 0,
  water_ml integer not null default 0,
  steps integer not null default 0,
  training_minutes integer not null default 0,
  sleep_hours numeric(4, 2) not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists daily_metrics_user_date_idx on public.daily_metrics (user_id, date desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists daily_metrics_updated_at on public.daily_metrics;
create trigger daily_metrics_updated_at
  before update on public.daily_metrics
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.daily_metrics enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "daily_metrics_select_own"
  on public.daily_metrics for select
  using (auth.uid() = user_id);

create policy "daily_metrics_insert_own"
  on public.daily_metrics for insert
  with check (auth.uid() = user_id);

create policy "daily_metrics_update_own"
  on public.daily_metrics for update
  using (auth.uid() = user_id);

create policy "daily_metrics_delete_own"
  on public.daily_metrics for delete
  using (auth.uid() = user_id);
