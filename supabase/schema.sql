-- =============================================================
-- Deskora — Database Schema
-- Run this once in your Supabase project:
--   Dashboard > SQL Editor > New query > paste all > Run
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP ... IF EXISTS.
-- =============================================================

-- ----------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- Profiles (one row per auth user)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  business_name text,
  email         text,
  business_type text,
  phone         text,
  country       text default 'Nigeria',
  timezone      text,
  currency      text default 'NGN',
  website       text,
  logo_url      text,
  onboarded     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- ----------------------------------------------------------------
-- Customers
-- ----------------------------------------------------------------
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  company     text,
  address     text,
  total_spent numeric(14,2) not null default 0,
  status      text not null default 'Active' check (status in ('Active','Inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.customers enable row level security;

drop policy if exists "customers_select_own" on public.customers;
drop policy if exists "customers_insert_own" on public.customers;
drop policy if exists "customers_update_own" on public.customers;
drop policy if exists "customers_delete_own" on public.customers;

create policy "customers_select_own" on public.customers for select using (auth.uid() = user_id);
create policy "customers_insert_own" on public.customers for insert with check (auth.uid() = user_id);
create policy "customers_update_own" on public.customers for update using (auth.uid() = user_id);
create policy "customers_delete_own" on public.customers for delete using (auth.uid() = user_id);

create index if not exists customers_user_id_idx on public.customers(user_id);

-- ----------------------------------------------------------------
-- Products & Services
-- ----------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  type        text not null default 'Product' check (type in ('Product','Service')),
  price       numeric(14,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_select_own" on public.products;
drop policy if exists "products_insert_own" on public.products;
drop policy if exists "products_update_own" on public.products;
drop policy if exists "products_delete_own" on public.products;

create policy "products_select_own" on public.products for select using (auth.uid() = user_id);
create policy "products_insert_own" on public.products for insert with check (auth.uid() = user_id);
create policy "products_update_own" on public.products for update using (auth.uid() = user_id);
create policy "products_delete_own" on public.products for delete using (auth.uid() = user_id);

create index if not exists products_user_id_idx on public.products(user_id);

-- ----------------------------------------------------------------
-- Invoices
-- ----------------------------------------------------------------
create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  customer_id   uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  customer_name text,
  amount        numeric(14,2) not null default 0,
  status        text not null default 'Draft' check (status in ('Paid','Pending','Overdue','Draft')),
  issue_date    date not null default current_date,
  due_date      date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.invoices enable row level security;

drop policy if exists "invoices_select_own" on public.invoices;
drop policy if exists "invoices_insert_own" on public.invoices;
drop policy if exists "invoices_update_own" on public.invoices;
drop policy if exists "invoices_delete_own" on public.invoices;

create policy "invoices_select_own" on public.invoices for select using (auth.uid() = user_id);
create policy "invoices_insert_own" on public.invoices for insert with check (auth.uid() = user_id);
create policy "invoices_update_own" on public.invoices for update using (auth.uid() = user_id);
create policy "invoices_delete_own" on public.invoices for delete using (auth.uid() = user_id);

create index if not exists invoices_user_id_idx on public.invoices(user_id);

-- ----------------------------------------------------------------
-- Quotes
-- ----------------------------------------------------------------
create table if not exists public.quotes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  customer_id   uuid references public.customers(id) on delete set null,
  quote_number  text not null,
  customer_name text,
  amount        numeric(14,2) not null default 0,
  status        text not null default 'Draft' check (status in ('Accepted','Pending','Sent','Draft','Rejected')),
  issue_date    date not null default current_date,
  valid_until   date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.quotes enable row level security;

drop policy if exists "quotes_select_own" on public.quotes;
drop policy if exists "quotes_insert_own" on public.quotes;
drop policy if exists "quotes_update_own" on public.quotes;
drop policy if exists "quotes_delete_own" on public.quotes;

create policy "quotes_select_own" on public.quotes for select using (auth.uid() = user_id);
create policy "quotes_insert_own" on public.quotes for insert with check (auth.uid() = user_id);
create policy "quotes_update_own" on public.quotes for update using (auth.uid() = user_id);
create policy "quotes_delete_own" on public.quotes for delete using (auth.uid() = user_id);

create index if not exists quotes_user_id_idx on public.quotes(user_id);

-- ----------------------------------------------------------------
-- Expenses
-- ----------------------------------------------------------------
create table if not exists public.expenses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  title          text not null,
  category       text,
  amount         numeric(14,2) not null default 0,
  payment_method text,
  spent_on       date not null default current_date,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.expenses enable row level security;

drop policy if exists "expenses_select_own" on public.expenses;
drop policy if exists "expenses_insert_own" on public.expenses;
drop policy if exists "expenses_update_own" on public.expenses;
drop policy if exists "expenses_delete_own" on public.expenses;

create policy "expenses_select_own" on public.expenses for select using (auth.uid() = user_id);
create policy "expenses_insert_own" on public.expenses for insert with check (auth.uid() = user_id);
create policy "expenses_update_own" on public.expenses for update using (auth.uid() = user_id);
create policy "expenses_delete_own" on public.expenses for delete using (auth.uid() = user_id);

create index if not exists expenses_user_id_idx on public.expenses(user_id);

-- ----------------------------------------------------------------
-- Payments
-- ----------------------------------------------------------------
create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  invoice_id    uuid references public.invoices(id) on delete set null,
  customer_id   uuid references public.customers(id) on delete set null,
  customer_name text,
  amount        numeric(14,2) not null default 0,
  method        text,
  status        text not null default 'Completed' check (status in ('Completed','Pending','Failed')),
  paid_on       date not null default current_date,
  created_at    timestamptz not null default now()
);

alter table public.payments enable row level security;

drop policy if exists "payments_select_own" on public.payments;
drop policy if exists "payments_insert_own" on public.payments;
drop policy if exists "payments_update_own" on public.payments;
drop policy if exists "payments_delete_own" on public.payments;

create policy "payments_select_own" on public.payments for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.payments for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.payments for update using (auth.uid() = user_id);
create policy "payments_delete_own" on public.payments for delete using (auth.uid() = user_id);

create index if not exists payments_user_id_idx on public.payments(user_id);

-- ----------------------------------------------------------------
-- Calendar events
-- ----------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  event_date  date not null,
  event_time  time,
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events_select_own" on public.events;
drop policy if exists "events_insert_own" on public.events;
drop policy if exists "events_update_own" on public.events;
drop policy if exists "events_delete_own" on public.events;

create policy "events_select_own" on public.events for select using (auth.uid() = user_id);
create policy "events_insert_own" on public.events for insert with check (auth.uid() = user_id);
create policy "events_update_own" on public.events for update using (auth.uid() = user_id);
create policy "events_delete_own" on public.events for delete using (auth.uid() = user_id);

create index if not exists events_user_id_idx on public.events(user_id);

-- ----------------------------------------------------------------
-- Auto-create a profile row when a new user signs up
-- Runs with security definer so it bypasses RLS safely.
-- ----------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, business_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'business_name', null),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================
-- Done. All tables, RLS policies, and the signup trigger are set.
-- =============================================================
