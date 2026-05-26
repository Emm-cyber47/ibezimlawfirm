-- Drop old policies (in case they were created with recursive logic)
drop policy if exists "Admins can delete submissions" on public.contact_submissions;
drop policy if exists "Admins can update any profile" on public.profiles;
drop policy if exists "Admins can delete any profile" on public.profiles;

-- Add DELETE policy for admins on contact_submissions
-- Uses the existing admins table (set up in 20250521000006) to avoid recursion
create policy "Admins can delete submissions"
  on public.contact_submissions for delete to authenticated
  using (exists (select 1 from public.admins where admin_id = auth.uid()));

-- Add UPDATE and DELETE policies for admins on profiles
-- Uses the existing admins table to avoid recursion on profiles
create policy "Admins can update any profile"
  on public.profiles for update to authenticated
  using (exists (select 1 from public.admins where admin_id = auth.uid()))
  with check (exists (select 1 from public.admins where admin_id = auth.uid()));

create policy "Admins can delete any profile"
  on public.profiles for delete to authenticated
  using (exists (select 1 from public.admins where admin_id = auth.uid()));
