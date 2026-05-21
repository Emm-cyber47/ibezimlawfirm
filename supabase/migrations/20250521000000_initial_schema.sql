-- Ibezim Law — initial Supabase schema (run in SQL Editor or via Supabase CLI)

-- ---------------------------------------------------------------------------
-- Contact form submissions (public insert only)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  matter text,
  message text not null
);

alter table public.contact_submissions enable row level security;

create policy "Public can submit contact form"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Client profiles (extends auth.users — used when you migrate off demo auth)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Blog engagement (optional — migrate from localStorage later)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  author_name text not null,
  message text not null,
  visitor_id text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_reactions (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  reaction_type text not null check (reaction_type in ('like', 'appreciate', 'insightful')),
  visitor_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (post_slug, visitor_id)
);

alter table public.blog_comments enable row level security;
alter table public.blog_reactions enable row level security;

create policy "Anyone can read blog comments"
  on public.blog_comments for select to anon, authenticated using (true);

create policy "Anyone can add blog comments"
  on public.blog_comments for insert to anon, authenticated with check (true);

create policy "Anyone can read blog reactions"
  on public.blog_reactions for select to anon, authenticated using (true);

create policy "Anyone can upsert own visitor reaction"
  on public.blog_reactions for insert to anon, authenticated with check (true);

create policy "Anyone can update own visitor reaction"
  on public.blog_reactions for update to anon, authenticated using (true);
