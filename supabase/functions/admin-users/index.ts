// Edge Function: admin-users
//
// Gerencia usuarios administradores com seguranca. Usa a service_role key
// (disponivel apenas no servidor) para criar usuarios e mexer em admin_users,
// mas SO depois de confirmar que quem chamou ja e um admin.
//
// Acoes (POST { action }):
//   - list      => lista TODOS os usuarios (email, data, is_admin, is_self)
//   - create    => cria um usuario novo { email, password, isAdmin }
//   - set_admin => promove/rebaixa um usuario { user_id, isAdmin }
//
// Deploy: supabase functions deploy admin-users

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Nao autenticado.' });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Cliente no contexto de quem chamou: usado para validar identidade e cargo.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: 'Sessao invalida.' });

    const { data: isAdmin, error: adminErr } = await userClient.rpc('is_admin');
    if (adminErr) return json({ error: 'Falha ao verificar permissao.' });
    if (!isAdmin) return json({ error: 'Acesso restrito a administradores.' });

    // Cliente privilegiado (service role) para operacoes administrativas.
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === 'list') {
      // Coleta todos os usuarios (paginado) e cruza com a lista de admins.
      const allUsers = [];
      let page = 1;
      const perPage = 1000;
      while (true) {
        const { data, error } = await admin.auth.admin.listUsers({
          page,
          perPage,
        });
        if (error) return json({ error: 'Erro ao listar usuarios.' });
        allUsers.push(...data.users);
        if (data.users.length < perPage) break;
        page++;
      }

      const { data: adminRows, error: adminRowsErr } = await admin
        .from('admin_users')
        .select('user_id');
      if (adminRowsErr) return json({ error: 'Erro ao listar administradores.' });
      const adminSet = new Set((adminRows ?? []).map((r) => r.user_id));

      const users = allUsers
        .map((u) => ({
          user_id: u.id,
          email: u.email ?? '—',
          created_at: u.created_at,
          is_admin: adminSet.has(u.id),
          is_self: u.id === user.id,
        }))
        .sort((a, b) => {
          if (a.is_admin !== b.is_admin) return a.is_admin ? -1 : 1;
          return a.email.localeCompare(b.email);
        });

      return json({ users });
    }

    if (action === 'create') {
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const makeAdmin = body.isAdmin !== false; // padrao: marca como admin

      if (!email || !email.includes('@')) {
        return json({ error: 'Informe um e-mail valido.' });
      }
      if (password.length < 6) {
        return json({ error: 'A senha deve ter ao menos 6 caracteres.' });
      }

      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
      if (createErr || !created.user) {
        return json({
          error: createErr?.message ?? 'Erro ao criar usuario.',
        });
      }

      if (makeAdmin) {
        const { error: insErr } = await admin
          .from('admin_users')
          .insert({ user_id: created.user.id });
        if (insErr) {
          return json({
            error: 'Usuario criado, mas falhou ao marcar como admin.',
          });
        }
      }

      return json({ ok: true, user_id: created.user.id });
    }

    if (action === 'set_admin') {
      const userId = String(body.user_id ?? '');
      const makeAdmin = body.isAdmin === true;
      if (!userId) return json({ error: 'user_id obrigatorio.' });
      if (userId === user.id && !makeAdmin) {
        return json({ error: 'Voce nao pode remover o proprio acesso.' });
      }

      if (makeAdmin) {
        const { error } = await admin
          .from('admin_users')
          .upsert({ user_id: userId }, { onConflict: 'user_id' });
        if (error) return json({ error: 'Erro ao promover o usuario.' });
      } else {
        const { error } = await admin
          .from('admin_users')
          .delete()
          .eq('user_id', userId);
        if (error) return json({ error: 'Erro ao rebaixar o usuario.' });
      }
      return json({ ok: true });
    }

    return json({ error: 'Acao desconhecida.' });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro inesperado.' });
  }
});
