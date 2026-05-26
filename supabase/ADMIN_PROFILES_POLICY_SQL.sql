-- Supabase SQL: Non-recursive admin policy + sync trigger
-- Copy & paste this into the Supabase SQL editor and run.

-- Drop old policy/function if present
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Create a lightweight admins table (keeps admin IDs separate from profiles to avoid RLS recursion)
CREATE TABLE IF NOT EXISTS public.admins (
  admin_id uuid PRIMARY KEY
);

-- Populate admins table from existing profiles where role = 'admin'
INSERT INTO public.admins (admin_id)
SELECT id FROM public.profiles WHERE role = 'admin'
ON CONFLICT (admin_id) DO NOTHING;

-- Trigger function to keep admins table in sync when profile role changes
CREATE OR REPLACE FUNCTION public.sync_admins()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.role = 'admin') THEN
      INSERT INTO public.admins (admin_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (NEW.role = 'admin') THEN
      INSERT INTO public.admins (admin_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
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

-- Attach trigger to profiles table
DROP TRIGGER IF EXISTS profiles_sync_admins ON public.profiles;
CREATE TRIGGER profiles_sync_admins
AFTER INSERT OR UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_admins();

-- New policy allowing authenticated users to SELECT profiles when they are in admins table
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE admin_id = auth.uid()));

-- Note:
-- 1) Paste and run this in the Supabase SQL editor.
-- 2) No RLS is applied to public.admins so policy checks won't recurse.
-- 3) If you need to add an admin manually: INSERT INTO public.admins (admin_id) VALUES ('<uuid>');