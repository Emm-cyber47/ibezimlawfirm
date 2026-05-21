# Supabase setup — Ibezim Law

You created the **ibezimlaw** Supabase project and linked GitHub. The frontend is a **Vite + React** app (not Next.js), so you connect with environment variables and `@supabase/supabase-js`.

## What the app uses today

| Feature | Current storage | After Supabase |
|--------|------------------|----------------|
| Contact form | Success UI only (no DB) | `contact_submissions` table |
| Login / signup | Supabase Auth + `profiles` (demo fallback if no env) |
| Blog comments/reactions | `localStorage` | `blog_comments` / `blog_reactions` (schema ready) |
| Client documents | IndexedDB in browser | Supabase Storage (later) |

Connecting the repo to GitHub helps **Supabase branching / migrations** in the dashboard; you still need API keys in the app and SQL applied to the database.

---

## Step 1 — Get API keys

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **ibezimlaw**.
2. Go to **Project Settings** → **API**.
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable key** (public, safe for the browser) → `VITE_SUPABASE_ANON_KEY`  
   Never put the **service_role** key in the React app.

---

## Step 2 — Local environment

In the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your URL and anon key.

**Common mistake:** `VITE_SUPABASE_URL` must be the **Project URL** (e.g. `https://abcdefgh.supabase.co`), **not** a publishable-key string. The publishable/anon key goes only in `VITE_SUPABASE_ANON_KEY`.

Restart the dev server:

```bash
npm run dev
```

---

## Step 3 — Create database tables

**Option A — SQL Editor (fastest)**

1. Dashboard → **SQL Editor** → New query.
2. Paste the contents of `supabase/migrations/20250521000000_initial_schema.sql`.
3. Run.

**Option B — Supabase CLI**

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

---

## Step 4 — Verify contact form

1. With `.env.local` set, submit the contact form on `/contact`.
2. In Dashboard → **Table Editor** → `contact_submissions`, you should see a new row.

If env vars are missing, the form still shows success (demo behavior) but nothing is stored.

---

## Step 5 — Auth (implemented in the app)

The app uses **Supabase Auth** when `.env.local` is set; otherwise it falls back to the local demo.

### Dashboard setup (required)

1. **Authentication** → **Configuration** → **Sign In / Providers** → **Email**:
   - Enable **Email**.
   - Turn **Confirm email** **ON** (required — if this is off, new users skip the inbox step and go straight to the profile).
   - Save the provider settings.
   - Enable **Google** if you use “Continue with Google”.
2. **Authentication** → **Configuration** → **URL Configuration**:
   - **Site URL:** `http://localhost:5173` (dev) and your production URL.
   - **Redirect URLs** — add every line:
     - `http://localhost:5173/profile`
     - `http://localhost:5173/auth/confirmed`
     - `http://localhost:5173/auth/reset-password`
     - `http://localhost:5173/**`
     - (repeat with your production domain when you deploy)
3. **Authentication** → **Notifications** → **Emails**:
   - **Confirm signup** and **Reset password** templates are used automatically.
   - On the free tier, Supabase sends these from their mailer (rate limits apply). For production, configure custom SMTP under **Project Settings → Authentication** (or Integrations).

### SQL after initial migration

Run these in the SQL Editor (in order):

1. `supabase/migrations/20250521000002_auth_profile_phone.sql` — phone on signup  
2. `supabase/migrations/20250521000003_profile_avatar_oauth.sql` — adds `avatar_url` for storing Google profile photos in the database.

3. In `.env.local` add (then restart `npm run dev`):

   ```bash
   VITE_PROFILES_AVATAR_COLUMN=true
   ```

   Leave this unset/false until migration **003** has been run. The app still shows Google names and photos from Google without it; this flag only enables saving the photo URL to `profiles`.

### What works in the UI

- **Sign up** → confirmation email → user opens link → `/auth/confirmed` → profile
- **Sign in** → email + password (after email is confirmed)
- **Forgot password** → reset email → `/auth/reset-password` → set new password → profile
- Profile page: view and edit name + phone (saved to `profiles`)
- Google sign-in (redirects to Google, then back to `/profile`)

### Google OAuth credentials

In **Authentication** → **Providers** → **Google**, follow Supabase’s steps to add Google Cloud OAuth client ID/secret.

---

## Step 6 — Production / hosting

Add the same variables wherever you deploy (e.g. Vercel):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy after saving. In Supabase → **Authentication** → **URL configuration**, add your live site URL to **Site URL** and **Redirect URLs**.

---

## Suggested order of work

1. ✅ Install client + env template + migration SQL (done in repo).
2. Run migration + `.env.local` → contact form saves to Supabase.
3. Configure Auth providers + redirect URLs → login, profile, Google OAuth.
4. Migrate **blog engagement** from localStorage.
5. **Storage** bucket for client documents with RLS per user.

---

## Troubleshooting

### Contact form: “We could not send your message…”

1. Confirm `VITE_SUPABASE_URL` is **Project URL** from Settings → API (format: `https://YOUR_REF.supabase.co`).
2. Confirm `VITE_SUPABASE_ANON_KEY` is the **anon** or **publishable** key — not the service_role key.
3. **Restart** `npm run dev` after changing `.env.local` (Vite only reads env on startup).
4. In dev, the error message includes the Supabase error in parentheses; also check the browser console.

### Tables show as “disabled” in Table Editor

That usually means **Row Level Security (RLS)** is on. The tables are not broken.

- Anonymous site visitors can **insert** into `contact_submissions` (contact form policy).
- The dashboard uses your **admin** session, which may have **no SELECT policy** on `contact_submissions` — so the UI can look empty or restricted even though inserts from the website work.
- To view submissions in the dashboard, use **SQL Editor**: `select * from contact_submissions order by created_at desc;`  
  Or add a read policy later for authenticated staff only.

If inserts still fail with permission errors, run `supabase/migrations/20250521000001_fix_api_access.sql` in the SQL Editor.

---

## Security reminders

- RLS is enabled on all public tables in the migration.
- Contact form: insert-only for anonymous users (no public read).
- Use **anon/publishable** key in the frontend only.
- Review policies in Dashboard → **Database** → **Policies** before going live.
