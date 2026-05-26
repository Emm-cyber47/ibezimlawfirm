-- Run this in Supabase SQL Editor to create the home images bucket

insert into storage.buckets (id, name, public)
values ('home-images', 'home-images', true)
on conflict (id) do nothing;

-- Allow public read
create policy "Public can read home images"
on storage.objects
for select
to public
using (bucket_id = 'home-images');

-- Allow authenticated users (admins) to upload
create policy "Authenticated users can upload home images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'home-images');

-- Allow authenticated users to update
create policy "Authenticated users can update home images"
on storage.objects
for update
to authenticated
using (bucket_id = 'home-images');

-- Allow authenticated users to delete
create policy "Authenticated users can delete home images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'home-images');