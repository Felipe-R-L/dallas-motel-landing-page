-- Categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON menu_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert categories"
  ON menu_categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own categories"
  ON menu_categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete own categories"
  ON menu_categories FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Products table
CREATE TABLE IF NOT EXISTS menu_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  image_url text DEFAULT '',
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  is_available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON menu_products FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "Admins can view all own products"
  ON menu_products FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can insert products"
  ON menu_products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own products"
  ON menu_products FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete own products"
  ON menu_products FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_products_category ON menu_products(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_products_available ON menu_products(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_categories_sort ON menu_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_products_sort ON menu_products(sort_order);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_menu_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_menu_products_updated_at ON menu_products;
CREATE TRIGGER set_menu_products_updated_at
  BEFORE UPDATE ON menu_products
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_products_updated_at();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read menu images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

CREATE POLICY "Auth users upload menu images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Auth users update menu images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'menu-images')
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Auth users delete menu images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'menu-images');