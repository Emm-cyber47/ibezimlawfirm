-- Run this in Supabase SQL Editor to create the attorney images bucket

insert into storage.buckets (id, name, public)
values ('attorney-images', 'attorney-images', true)
on conflict (id) do nothing;

-- Allow public read
create policy "Public can read attorney images"
on storage.objects
for select
to public
using (bucket_id = 'attorney-images');

-- Allow authenticated users (admins) to upload
create policy "Authenticated users can upload attorney images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'attorney-images');

-- Allow authenticated users to update
create policy "Authenticated users can update attorney images"
on storage.objects
for update
to authenticated
using (bucket_id = 'attorney-images');

-- Allow authenticated users to delete
create policy "Authenticated users can delete attorney images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'attorney-images');