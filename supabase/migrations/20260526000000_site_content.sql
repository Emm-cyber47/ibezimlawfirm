-- Table to store editable website content as JSONB key-value pairs
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Public can read site content (needed for the public pages to display it)
create policy "Public can read site content"
on public.site_content
for select
to public
using (true);

-- Admins can insert/update site content
create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  exists (select 1 from public.admins where admins.admin_id = auth.uid())
);

create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using (
  exists (select 1 from public.admins where admins.admin_id = auth.uid())
);

create policy "Admins can delete site content"
on public.site_content
for delete
to authenticated
using (
  exists (select 1 from public.admins where admins.admin_id = auth.uid())
);