-- Fix: grant API roles access + ensure contact form can insert

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Contact form only needs insert for anonymous visitors
grant insert on table public.contact_submissions to anon, authenticated;
