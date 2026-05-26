-- Run this in Supabase SQL Editor to create the practice area images bucket
-- Also grants admin full access to the bucket

insert into storage.buckets (id, name, public)
values ('practice-area-images', 'practice-area-images', true)
on conflict (id) do nothing;

-- Allow public read
create policy "Public can read practice area images"
on storage.objects
for select
to public
using (bucket_id = 'practice-area-images');

-- Allow authenticated users (admins) to upload
create policy "Authenticated users can upload practice area images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'practice-area-images');

-- Allow authenticated users to update
create policy "Authenticated users can update practice area images"
on storage.objects
for update
to authenticated
using (bucket_id = 'practice-area-images');

-- Allow authenticated users to delete
create policy "Authenticated users can delete practice area images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'practice-area-images');