-- Safe cleanup + re-apply non-recursive admin policy/trigger
-- Run in Supabase SQL editor.

BEGIN;

-- 1) Remove old/recursive artifacts (if they exist)
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Trigger cleanup
DROP TRIGGER IF EXISTS profiles_sync_admins ON public.profiles;

-- Trigger function cleanup (safe to drop; will be re-created)
DROP FUNCTION IF EXISTS public.sync_admins();

-- 2) Ensure admins table exists (no RLS)
CREATE TABLE IF NOT EXISTS public.admins (
  admin_id uuid PRIMARY KEY
);

-- Optional: remove duplicates if table already has bad state (should not happen due to PK)
-- DELETE FROM public.admins a
-- USING public.admins b
-- WHERE a.ctid < b.ctid AND a.admin_id = b.admin_id;

-- 3) Re-populate admins table from existing profiles (role='admin')
INSERT INTO public.admins (admin_id)
SELECT id
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (admin_id) DO NOTHING;

-- 4) Re-create sync trigger function
CREATE OR REPLACE FUNCTION public.sync_admins()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.role = 'admin') THEN
      INSERT INTO public.admins (admin_id) VALUES (NEW.id)
      ON CONFLICT (admin_id) DO NOTHING;
    END IF;
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    IF (NEW.role = 'admin') THEN
      INSERT INTO public.admins (admin_id) VALUES (NEW.id)
      ON CONFLICT (admin_id) DO NOTHING;
    ELSE
      DELETE FROM public.admins WHERE admin_id = NEW.id;
    END IF;
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM public.admins WHERE admin_id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- 5) Attach trigger to profiles table
CREATE TRIGGER profiles_sync_admins
AFTER INSERT OR UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_admins();

-- 6) Create (or re-create) the admin read policy on profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE admin_id = auth.uid()));

COMMIT;

-- Notes:
-- - This removes recursive policy/helper artifacts and re-applies the admins-table approach.
-- - If your auth layer is still trying to upsert profiles redundantly, you may also need to inspect your OAuth/profile sync logic, but this addresses the recursion + admin policy foundation first.

