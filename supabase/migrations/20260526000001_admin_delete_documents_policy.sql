-- Add DELETE policy for admins on client_documents
-- This was missing - only users could delete their own documents via the "Users can delete own documents" policy
-- Admins need this to delete documents from the admin panel

create policy "Admins can delete client documents"
  on public.client_documents for delete to authenticated
  using (exists (select 1 from public.admins where admin_id = auth.uid()));