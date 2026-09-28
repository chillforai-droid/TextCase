-- TextCase Prompt Store Admin RLS
-- Run this ONCE after the existing prompt_store.sql.
-- Create the admin user in Supabase Auth first, then add their UUID to prompt_admins.

create table if not exists public.prompt_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.prompt_admins enable row level security;

drop policy if exists "Admins can read their own admin record" on public.prompt_admins;
create policy "Admins can read their own admin record"
  on public.prompt_admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_prompt_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.prompt_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_prompt_admin() from public;
grant execute on function public.is_prompt_admin() to authenticated;

drop policy if exists "Prompt admins can manage categories" on public.prompt_categories;
create policy "Prompt admins can manage categories"
  on public.prompt_categories for all
  to authenticated
  using (public.is_prompt_admin())
  with check (public.is_prompt_admin());

drop policy if exists "Prompt admins can manage prompts" on public.prompts;
create policy "Prompt admins can manage prompts"
  on public.prompts for all
  to authenticated
  using (public.is_prompt_admin())
  with check (public.is_prompt_admin());

-- After creating the Auth user, run:
-- insert into public.prompt_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
