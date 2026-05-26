-- Testimonials (admin CRUD)
-- Table matches current `src/data/site.ts` shape

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  location text not null,
  matter text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- Public read
create policy "Public can read testimonials"
on public.testimonials
for select
to public
using (true);

-- Admin insert
create policy "Admins can insert testimonials"
on public.testimonials
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and lower(profiles.role) = 'admin'
  )
);

-- Admin update
create policy "Admins can update testimonials"
on public.testimonials
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and lower(profiles.role) = 'admin'
  )
);

-- Admin delete
create policy "Admins can delete testimonials"
on public.testimonials
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and lower(profiles.role) = 'admin'
  )
);

create or replace function public.update_testimonials_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_testimonials_updated_at_trigger on public.testimonials;
create trigger update_testimonials_updated_at_trigger
before update on public.testimonials
for each row
execute function public.update_testimonials_updated_at();

