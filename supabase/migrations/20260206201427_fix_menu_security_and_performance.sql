-- Fix Menu Security and Performance Issues
-- 1. Add missing indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_menu_categories_created_by ON menu_categories(created_by);
CREATE INDEX IF NOT EXISTS idx_menu_products_created_by ON menu_products(created_by);

-- 2. Drop and recreate all RLS policies with optimized auth calls

-- menu_categories policies
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON menu_categories;
CREATE POLICY "Authenticated users can insert categories"
  ON menu_categories FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Authenticated users can update own categories" ON menu_categories;
CREATE POLICY "Authenticated users can update own categories"
  ON menu_categories FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Authenticated users can delete own categories" ON menu_categories;
CREATE POLICY "Authenticated users can delete own categories"
  ON menu_categories FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

-- menu_products policies
DROP POLICY IF EXISTS "Admins can view all own products" ON menu_products;
CREATE POLICY "Admins can view all own products"
  ON menu_products FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Authenticated users can insert products" ON menu_products;
CREATE POLICY "Authenticated users can insert products"
  ON menu_products FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Authenticated users can update own products" ON menu_products;
CREATE POLICY "Authenticated users can update own products"
  ON menu_products FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

DROP POLICY IF EXISTS "Authenticated users can delete own products" ON menu_products;
CREATE POLICY "Authenticated users can delete own products"
  ON menu_products FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

-- 3. Fix function search path
CREATE OR REPLACE FUNCTION public.update_menu_products_updated_at()
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