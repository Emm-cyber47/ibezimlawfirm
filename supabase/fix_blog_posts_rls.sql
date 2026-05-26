-- Fix blog_posts RLS policies to use admins table instead of recursive profiles check
-- This avoids the silent failure on UPDATE/DELETE operations

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins WHERE admins.admin_id = auth.uid()
  )
);

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE admins.admin_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE admins.admin_id = auth.uid()
  )
);