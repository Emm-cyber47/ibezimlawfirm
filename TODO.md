# TODO (Blog Admin CRUD + Dashboard/Sidebar)

## Step 1 — Supabase schema
- Create new migration `supabase/migrations/<timestamp>_blog_posts.sql`:
  - Create table `public.blog_posts` (slug unique; title/excerpt/category/author_name/read_time/image_key; body text[]; date timestamptz).
  - Enable RLS.
  - Add policies:
    - Public can read all blog posts.
    - Admin can insert/update/delete.

## Step 2 — Admin data-access layer
- Add `src/lib/adminBlogPosts.ts` with CRUD functions:
  - `listAllBlogPosts()`
  - `getBlogPostBySlug(slug)`
  - `createBlogPost(post)`
  - `updateBlogPost(slug, patch)`
  - `deleteBlogPost(slug)`

## Step 3 — Admin UI
- Add `src/pages/admin/Blog.tsx`:
  - List posts with edit/delete actions.
- Add `src/pages/admin/BlogEditor.tsx`:
  - Editor form for create/edit.

## Step 4 — Admin navigation + dashboard card
- Update `src/components/AdminSidebar.tsx` to include a “Blog” link.
- Update `src/pages/admin/Dashboard.tsx` to add a “Blog” stats card that links to Blog management.

## Step 5 — Frontend Resources wiring
- Update `src/pages/Resources.tsx` to load posts from Supabase (instead of `src/data/site.ts`).
- Update `src/pages/ResourcePost.tsx` to load a single post by slug from Supabase.
- Keep existing styling and engagement components intact.

## Step 6 — Testing
- Verify:
  - Admin can create/edit/delete blog posts.
  - Frontend Resources updates accordingly.
  - RLS blocks non-admin writes.

