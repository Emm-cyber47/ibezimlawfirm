-- Profile photo + richer OAuth name parsing on signup

alter table public.profiles
  add column if not exists avatar_url text not null default '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  full_name text := trim(coalesce(meta->>'full_name', meta->>'name', ''));
  first_part text;
  last_part text;
begin
  first_part := trim(coalesce(meta->>'first_name', meta->>'given_name', ''));
  last_part := trim(coalesce(meta->>'last_name', meta->>'family_name', ''));

  if (first_part = '' or last_part = '') and full_name <> '' then
    first_part := coalesce(nullif(first_part, ''), split_part(full_name, ' ', 1));
    last_part := coalesce(
      nullif(last_part, ''),
      nullif(trim(substring(full_name from position(' ' in full_name) + 1)), ''),
      ''
    );
  end if;

  insert into public.profiles (id, email, first_name, last_name, phone, avatar_url)
  values (
    new.id,
    new.email,
    first_part,
    last_part,
    coalesce(meta->>'phone', meta->>'phone_number', ''),
    coalesce(meta->>'avatar_url', meta->>'picture', '')
  );
  return new;
end;
$$;
