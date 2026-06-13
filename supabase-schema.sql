-- Run this in Supabase Dashboard → SQL Editor

-- ── Tables ──────────────────────────────────────────────────

create table if not exists profiles (
  id uuid references auth.users primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists accounts (
  id text primary key,
  user_id uuid references auth.users not null,
  name text not null,
  kind text default '',
  last4 text default '',
  balance integer default 0,
  hue integer default 218,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id text primary key,
  user_id uuid references auth.users not null,
  type text not null check (type in ('income', 'expense', 'transfer')),
  amount integer not null,
  title text default '',
  acct text,
  "from" text,
  "to" text,
  cat text,
  date text not null,
  time text default '00:00',
  created_at timestamptz default now()
);

create table if not exists budgets (
  id text primary key,
  user_id uuid references auth.users not null,
  "limit" integer not null,
  created_at timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────

alter table profiles enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;

-- profiles
create policy "users_own_profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- accounts
create policy "users_own_accounts" on accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- transactions
create policy "users_own_transactions" on transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- budgets
create policy "users_own_budgets" on budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Auto-create profile on signup ───────────────────────────

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
