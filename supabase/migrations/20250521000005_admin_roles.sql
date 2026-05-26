-- Add admin roles to profiles table and RLS policies for admin access

alter table public.profiles
add column if not exists role text not null default 'user'
check (role in ('user', 'admin', 'staff'));

-- Admin can read all contact submissions
create policy "Admins can read all submissions"
  on public.contact_submissions for select to authenticated
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin can read all client documents
create policy "Admins can read all documents"
  on public.client_documents for select to authenticated
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    ) or auth.uid() = user_id
  );

-- Admin can delete blog comments
create policy "Admins can delete comments"
  on public.blog_comments for delete to authenticated
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
