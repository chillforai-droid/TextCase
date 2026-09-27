-- TextCase Prompt Store schema
-- Run this in Supabase SQL Editor before using the standalone Prompt Admin.

create table if not exists public.prompt_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.prompt_categories(id) on delete cascade,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  prompt_text text not null,
  use_case text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prompt_categories_published_sort_idx
  on public.prompt_categories (is_published, sort_order, name);

create index if not exists prompts_category_published_sort_idx
  on public.prompts (category_id, is_published, sort_order, created_at desc);

create index if not exists prompts_slug_idx on public.prompts (slug);

alter table public.prompt_categories enable row level security;
alter table public.prompts enable row level security;

drop policy if exists "Public can read published prompt categories" on public.prompt_categories;
create policy "Public can read published prompt categories"
  on public.prompt_categories for select
  using (is_published = true);

drop policy if exists "Public can read published prompts" on public.prompts;
create policy "Public can read published prompts"
  on public.prompts for select
  using (is_published = true);

-- The standalone Prompt Admin should use authenticated/admin-only write policies.
-- Do not add public INSERT/UPDATE/DELETE policies.
