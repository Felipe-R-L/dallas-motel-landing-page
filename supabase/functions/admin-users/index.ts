// Edge Function: admin-users
//
// Gerencia usuarios administradores com seguranca. Usa a service_role key
// (disponivel apenas no servidor) para criar usuarios e mexer em admin_users,
// mas SO depois de confirmar que quem chamou ja e um admin.
//
// Acoes (POST { action }):
//   - list         => lista os admins atuais (email + data)
//   - create       => cria um usuario novo { email, password, isAdmin }
//   - remove_admin => revoga o status de admin { user_id }
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
      const { data: rows, error } = await admin
        .from('admin_users')
        .select('user_id, created_at')
        .order('created_at');
      if (error) return json({ error: 'Erro ao listar administradores.' });

      const admins = [];
      for (const r of rows ?? []) {
        const { data } = await admin.auth.admin.getUserById(r.user_id);
        admins.push({
          user_id: r.user_id,
          email: data.user?.email ?? '—',
          created_at: r.created_at,
        });
      }
      return json({ admins });
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

    if (action === 'remove_admin') {
      const userId = String(body.user_id ?? '');
      if (!userId) return json({ error: 'user_id obrigatorio.' });
      if (userId === user.id) {
        return json({ error: 'Voce nao pode remover o proprio acesso.' });
      }
      const { error } = await admin
        .from('admin_users')
        .delete()
        .eq('user_id', userId);
      if (error) return json({ error: 'Erro ao remover o administrador.' });
      return json({ ok: true });
    }

    return json({ error: 'Acao desconhecida.' });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro inesperado.' });
  }
});
