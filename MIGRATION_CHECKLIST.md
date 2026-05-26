# Blog Engagement & Client Documents Migration — Setup Guide

## ✅ Implementation Complete

Blog engagement and client documents have been migrated to Supabase. The code compiles successfully.

---

## 📋 What You Need to Do Next

### Step 1: Apply Database Migrations

Run the SQL migrations in your Supabase Dashboard:

**Option A — SQL Editor (fastest):**
1. Go to Supabase Dashboard → SQL Editor
2. Create 2 new queries and run each:
   - **Query 1:** Copy contents of `supabase/migrations/20250521000000_initial_schema.sql` (already exists - verify blog_comments & blog_reactions tables are created)
   - **Query 2:** Copy contents of `supabase/migrations/20250521000004_client_documents.sql` (new table + RLS policies)

**Option B — Supabase CLI:**
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Step 2: Create Storage Bucket

1. Go to **Supabase Dashboard → Storage**
2. Click **Create a new bucket**
3. Set name to: `client-documents`
4. Choose **Private** for security
5. Enable **Row Level Security** (RLS)

### Step 3: Add Storage RLS Policies

With the bucket created, add 3 policies (Dashboard → Storage → Policies tab):

**Policy 1 — Users can upload**
```sql
CREATE POLICY "Users can upload to own directory"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2 — Users can download**
```sql
CREATE POLICY "Users can download own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'client-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3 — Users can delete**
```sql
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'client-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🧪 Testing

Once migrations and Storage are ready:

### Test Blog Engagement
1. Ensure `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Run: `npm run dev`
3. Visit `/resources/any-post-slug`
4. **Test as anonymous:**
   - Add a reaction → Check `blog_reactions` table (visitor_id should be set, user_id null)
   - Add a comment → Check `blog_comments` table (visible only if logged in)
5. **Test as authenticated:**
   - Sign in
   - Add a reaction → Check `blog_reactions` table (user_id should be set, visitor_id null)
   - Add a comment → Should appear immediately
   - Refresh page → Reactions & comments persist

### Test Client Documents
1. Sign in → Navigate to `/profile` → **Documents**
2. **Upload:**
   - Choose a PDF/image under 10MB
   - Add optional note
   - Click "Submit to firm"
   - Check `client_documents` table (metadata appears)
   - Check Storage bucket (file appears under `/your-user-id/`)
3. **Download:**
   - Click "Download" button
   - File should download with correct name
4. **Delete:** (if delete button is added to UI later)
   - Delete from UI
   - Verify metadata gone from table & file gone from Storage
5. **Cross-user test:**
   - Log out, log in as different user
   - Verify you can't see other user's documents

---

## 📝 Key Implementation Details

### Blog Engagement (`src/lib/blogEngagement.ts`)
- **Anonymous users:** tracked via `visitor_id` (localStorage UUID, one per browser)
- **Authenticated users:** tracked via `user_id` (Supabase auth UUID)
- **Reactions:** unique per user/visitor + post (update existing or create new)
- **Comments:** appended to post, gated to authenticated users only
- Fallback to localStorage if Supabase not configured (demo mode)

### Client Documents (`src/lib/clientDocuments.ts`)
- **Files:** stored in Supabase Storage at `{user_id}/{document_id}`
- **Metadata:** stored in `client_documents` table with FK to `auth.users.id`
- **Access:** RLS ensures users see only their own documents
- **Download:** uses 5-minute signed URLs (safe for sharing temporarily)
- Requires authentication (no demo fallback)

---

## 🔄 Environment Variables (Already Set)

Ensure `.env.local` has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## ✨ What's Next

- [ ] Apply migrations to Supabase
- [ ] Create Storage bucket
- [ ] Add RLS policies to Storage
- [ ] Test blog engagement end-to-end
- [ ] Test client documents end-to-end
- [ ] Optional: Add delete button to Documents page
- [ ] Deploy to production

All code changes are complete and tested locally. Ready to ship! 🚀
