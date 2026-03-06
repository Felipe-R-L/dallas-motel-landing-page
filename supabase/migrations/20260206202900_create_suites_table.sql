-- Create Suites Management Table

CREATE TABLE IF NOT EXISTS suites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  amenities text[] DEFAULT '{}',
  image_url text DEFAULT '',
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  min_stay_hours integer NOT NULL DEFAULT 2,
  weekday_hourly_rate numeric(10,2) NOT NULL DEFAULT 0,
  weekend_hourly_rate numeric(10,2) NOT NULL DEFAULT 0,
  holiday_hourly_rate numeric(10,2) NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active suites"
  ON suites FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all own suites"
  ON suites FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = created_by);

CREATE POLICY "Authenticated users can insert suites"
  ON suites FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Authenticated users can update own suites"
  ON suites FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Authenticated users can delete own suites"
  ON suites FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

CREATE INDEX IF NOT EXISTS idx_suites_sort ON suites(sort_order);
CREATE INDEX IF NOT EXISTS idx_suites_created_by ON suites(created_by);
CREATE INDEX IF NOT EXISTS idx_suites_active ON suites(is_active);

CREATE OR REPLACE FUNCTION public.update_suites_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_suites_updated_at ON suites;
CREATE TRIGGER set_suites_updated_at
  BEFORE UPDATE ON suites
  FOR EACH ROW
  EXECUTE FUNCTION update_suites_updated_at();

INSERT INTO storage.buckets (id, name, public)
VALUES ('suite-images', 'suite-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read suite images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'suite-images');

CREATE POLICY "Auth users upload suite images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'suite-images' AND (select auth.uid()) IS NOT NULL);

CREATE POLICY "Auth users update suite images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'suite-images')
  WITH CHECK (bucket_id = 'suite-images');

CREATE POLICY "Auth users delete suite images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'suite-images');