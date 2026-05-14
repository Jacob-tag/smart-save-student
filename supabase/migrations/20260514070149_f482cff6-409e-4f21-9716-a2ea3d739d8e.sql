
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text,
  year_of_study text,
  course text,
  country text,
  currency text not null default 'ZAR',
  payday integer,
  notif_budget_alerts boolean not null default true,
  notif_weekly_summary boolean not null default true,
  notif_goal_milestones boolean not null default true,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- AUTO PROFILE TRIGGER
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- INCOME SOURCES
create table public.income_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  monthly_amount numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table public.income_sources enable row level security;
create policy "own income select" on public.income_sources for select using (auth.uid() = user_id);
create policy "own income insert" on public.income_sources for insert with check (auth.uid() = user_id);
create policy "own income update" on public.income_sources for update using (auth.uid() = user_id);
create policy "own income delete" on public.income_sources for delete using (auth.uid() = user_id);

-- FIXED EXPENSES
create table public.fixed_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric not null default 0,
  day_of_month integer,
  created_at timestamptz not null default now()
);
alter table public.fixed_expenses enable row level security;
create policy "own fx select" on public.fixed_expenses for select using (auth.uid() = user_id);
create policy "own fx insert" on public.fixed_expenses for insert with check (auth.uid() = user_id);
create policy "own fx update" on public.fixed_expenses for update using (auth.uid() = user_id);
create policy "own fx delete" on public.fixed_expenses for delete using (auth.uid() = user_id);

-- BUDGETS
create table public.budgets_v2 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  allocated numeric not null default 0,
  period text not null default 'monthly',
  created_at timestamptz not null default now(),
  unique (user_id, category)
);
alter table public.budgets_v2 enable row level security;
create policy "own budget select" on public.budgets_v2 for select using (auth.uid() = user_id);
create policy "own budget insert" on public.budgets_v2 for insert with check (auth.uid() = user_id);
create policy "own budget update" on public.budgets_v2 for update using (auth.uid() = user_id);
create policy "own budget delete" on public.budgets_v2 for delete using (auth.uid() = user_id);

-- GOALS
create table public.goals_v2 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target numeric not null default 0,
  saved numeric not null default 0,
  deadline date,
  priority text not null default 'Medium',
  monthly numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table public.goals_v2 enable row level security;
create policy "own goal select" on public.goals_v2 for select using (auth.uid() = user_id);
create policy "own goal insert" on public.goals_v2 for insert with check (auth.uid() = user_id);
create policy "own goal update" on public.goals_v2 for update using (auth.uid() = user_id);
create policy "own goal delete" on public.goals_v2 for delete using (auth.uid() = user_id);

-- TRANSACTIONS
create table public.transactions_v2 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  description text not null,
  category text not null,
  amount numeric not null default 0,
  type text not null check (type in ('income','expense')),
  method text not null default 'Card',
  status text not null default 'Cleared',
  created_at timestamptz not null default now()
);
alter table public.transactions_v2 enable row level security;
create policy "own tx select" on public.transactions_v2 for select using (auth.uid() = user_id);
create policy "own tx insert" on public.transactions_v2 for insert with check (auth.uid() = user_id);
create policy "own tx update" on public.transactions_v2 for update using (auth.uid() = user_id);
create policy "own tx delete" on public.transactions_v2 for delete using (auth.uid() = user_id);

create index on public.transactions_v2 (user_id, date desc);
