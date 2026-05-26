-- Client documents metadata table and RLS policies

create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  size integer not null,
  note text not null default '',
  status text not null default 'submitted',
  uploaded_at timestamptz not null default now()
);

alter table public.client_documents enable row level security;

create policy "Users can insert own documents"
  on public.client_documents for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own documents"
  on public.client_documents for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.client_documents for delete to authenticated
  using (auth.uid() = user_id);
