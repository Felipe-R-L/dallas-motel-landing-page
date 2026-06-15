-- Role-Based Admin Authorization
--
-- Substitui o modelo de posse (created_by = auth.uid()) por um modelo de cargo.
-- Antes: QUALQUER usuario autenticado podia inserir/editar/excluir os proprios
-- registros (e, com signup aberto, qualquer pessoa que criasse conta virava "admin").
-- Agora: apenas usuarios presentes em `admin_users` podem escrever, e um admin
-- enxerga/edita TODOS os registros (resolve o problema de multiplos admins).

-- 1. Tabela de admins -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Funcao helper is_admin() ----------------------------------------------
-- SECURITY DEFINER => executa com o dono da funcao e ignora RLS ao consultar
-- admin_users, evitando recursao de policy. search_path travado por seguranca.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Admins podem listar a si mesmos; alteracoes em admin_users sao feitas apenas
-- via SQL Editor (service role), nunca pelo cliente.
DROP POLICY IF EXISTS "Admins can view admin list" ON admin_users;
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

-- 3. menu_categories --------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON menu_categories;
DROP POLICY IF EXISTS "Authenticated users can update own categories" ON menu_categories;
DROP POLICY IF EXISTS "Authenticated users can delete own categories" ON menu_categories;
DROP POLICY IF EXISTS "Admins can view all categories" ON menu_categories;

CREATE POLICY "Admins can view all categories"
  ON menu_categories FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert categories"
  ON menu_categories FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update categories"
  ON menu_categories FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete categories"
  ON menu_categories FOR DELETE TO authenticated USING (is_admin());

-- 4. menu_products ----------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all own products" ON menu_products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON menu_products;
DROP POLICY IF EXISTS "Authenticated users can update own products" ON menu_products;
DROP POLICY IF EXISTS "Authenticated users can delete own products" ON menu_products;
DROP POLICY IF EXISTS "Admins can view all products" ON menu_products;

CREATE POLICY "Admins can view all products"
  ON menu_products FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert products"
  ON menu_products FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update products"
  ON menu_products FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete products"
  ON menu_products FOR DELETE TO authenticated USING (is_admin());

-- 5. suites -----------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all own suites" ON suites;
DROP POLICY IF EXISTS "Authenticated users can insert suites" ON suites;
DROP POLICY IF EXISTS "Authenticated users can update own suites" ON suites;
DROP POLICY IF EXISTS "Authenticated users can delete own suites" ON suites;
DROP POLICY IF EXISTS "Admins can view all suites" ON suites;

CREATE POLICY "Admins can view all suites"
  ON suites FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert suites"
  ON suites FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update suites"
  ON suites FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete suites"
  ON suites FOR DELETE TO authenticated USING (is_admin());

-- 6. holidays ---------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can insert holidays" ON holidays;
DROP POLICY IF EXISTS "Authenticated users can update own holidays" ON holidays;
DROP POLICY IF EXISTS "Authenticated users can delete own holidays" ON holidays;

CREATE POLICY "Admins can insert holidays"
  ON holidays FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update holidays"
  ON holidays FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete holidays"
  ON holidays FOR DELETE TO authenticated USING (is_admin());

-- 7. storage (imagens) ------------------------------------------------------
-- Leitura publica mantida; escrita restrita a admins (antes: qualquer
-- autenticado podia sobrescrever/excluir qualquer imagem do bucket).
DROP POLICY IF EXISTS "Auth users upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users delete menu images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload suite images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users update suite images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users delete suite images" ON storage.objects;

CREATE POLICY "Admins upload menu images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'menu-images' AND is_admin());
CREATE POLICY "Admins update menu images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'menu-images' AND is_admin())
  WITH CHECK (bucket_id = 'menu-images' AND is_admin());
CREATE POLICY "Admins delete menu images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'menu-images' AND is_admin());

CREATE POLICY "Admins upload suite images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'suite-images' AND is_admin());
CREATE POLICY "Admins update suite images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'suite-images' AND is_admin())
  WITH CHECK (bucket_id = 'suite-images' AND is_admin());
CREATE POLICY "Admins delete suite images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'suite-images' AND is_admin());

-- 8. PROMOVER O PRIMEIRO ADMIN ---------------------------------------------
-- IMPORTANTE: rode o bloco abaixo (no SQL Editor do Supabase) trocando o e-mail
-- pelo da sua conta de admin. Sem isso, NINGUEM consegue gerenciar o painel.
--
--   INSERT INTO admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com'
--   ON CONFLICT (user_id) DO NOTHING;
--
-- Para conferir quem e admin:
--   SELECT u.email FROM admin_users a JOIN auth.users u ON u.id = a.user_id;
