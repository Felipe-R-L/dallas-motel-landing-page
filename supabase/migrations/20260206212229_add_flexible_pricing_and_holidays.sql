-- Add Flexible Pricing System and Holidays Table

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suites' AND column_name = 'weekday_base_price'
  ) THEN
    ALTER TABLE suites ADD COLUMN weekday_base_price numeric(10,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suites' AND column_name = 'weekend_base_price'
  ) THEN
    ALTER TABLE suites ADD COLUMN weekend_base_price numeric(10,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

UPDATE suites SET weekday_base_price = base_price WHERE weekday_base_price = 0 AND base_price > 0;
UPDATE suites SET weekend_base_price = base_price WHERE weekend_base_price = 0 AND base_price > 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'suites' AND constraint_name = 'suites_weekday_base_price_check'
  ) THEN
    ALTER TABLE suites ADD CONSTRAINT suites_weekday_base_price_check CHECK (weekday_base_price >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'suites' AND constraint_name = 'suites_weekend_base_price_check'
  ) THEN
    ALTER TABLE suites ADD CONSTRAINT suites_weekend_base_price_check CHECK (weekend_base_price >= 0);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view holidays"
  ON holidays FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert holidays"
  ON holidays FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Authenticated users can update own holidays"
  ON holidays FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Authenticated users can delete own holidays"
  ON holidays FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_created_by ON holidays(created_by);
