create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  author_name text not null default 'Admin',
  read_time text not null,
  image_key text,
  body text[] not null default '{}',

  date timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- PUBLIC READ
create policy "Public can read blog posts"
on public.blog_posts
for select
to public
using (true);

-- ADMIN INSERT
create policy "Admins can insert blog posts"
on public.blog_posts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admins
    where admins.admin_id = auth.uid()
  )
);

-- ADMIN UPDATE
create policy "Admins can update blog posts"
on public.blog_posts
for update
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.admin_id = auth.uid()
  )
);

-- ADMIN DELETE
create policy "Admins can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.admin_id = auth.uid()
  )
);

create or replace function public.update_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_blog_posts_updated_at_trigger
on public.blog_posts;

create trigger update_blog_posts_updated_at_trigger
before update on public.blog_posts
for each row
execute function public.update_blog_posts_updated_at();