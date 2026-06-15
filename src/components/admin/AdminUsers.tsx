import { useState, useEffect } from 'react';
import { UserPlus, ShieldCheck, Users, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Spinner from '../ui/Spinner';

type AppUser = {
  user_id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  is_self: boolean;
};

type FnResponse = { ok?: boolean; error?: string; users?: AppUser[] };

async function callAdminFn(body: Record<string, unknown>): Promise<FnResponse> {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    body,
  });
  if (error) return { error: 'Falha de conexao com o servidor.' };
  return data as FnResponse;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [makeAdmin, setMakeAdmin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await callAdminFn({ action: 'list' });
    if (res.error) setError(res.error);
    else setUsers(res.users ?? []);
    setLoading(false);
  };

  const createUser = async () => {
    setError('');
    setSuccess('');

    if (!email.includes('@')) {
      setError('Informe um e-mail valido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    setSaving(true);
    const res = await callAdminFn({
      action: 'create',
      email,
      password,
      isAdmin: makeAdmin,
    });
    setSaving(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess(
      makeAdmin
        ? 'Usuario criado e marcado como administrador.'
        : 'Usuario criado com sucesso.'
    );
    setEmail('');
    setPassword('');
    setMakeAdmin(true);
    fetchUsers();
  };

  const setAdmin = async (user: AppUser, isAdmin: boolean) => {
    const verb = isAdmin ? 'promover' : 'rebaixar';
    if (!confirm(`Deseja ${verb} ${user.email}?`)) return;

    setError('');
    setSuccess('');
    setPendingId(user.user_id);
    const res = await callAdminFn({
      action: 'set_admin',
      user_id: user.user_id,
      isAdmin,
    });
    setPendingId(null);

    if (res.error) {
      setError(res.error);
      return;
    }
    fetchUsers();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

  const inputClass =
    'w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors';
  const labelClass = 'block text-gray-400 text-xs mb-1.5';

  return (
    <div className="max-w-2xl">
      <div className="bg-velvet-800/40 border border-velvet-700/40 rounded-xl p-5 mb-6">
        <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-gold-400" />
          Criar novo usuario
        </h3>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>E-mail *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="usuario@exemplo.com"
              autoComplete="off"
            />
          </div>

          <div>
            <label className={labelClass}>Senha *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="Minimo 6 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={makeAdmin}
            onClick={() => setMakeAdmin((v) => !v)}
            className="flex items-center gap-3"
          >
            <span
              className={`relative w-10 h-5 rounded-full transition-colors ${
                makeAdmin ? 'bg-gold-400' : 'bg-velvet-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  makeAdmin ? 'left-5' : 'left-0.5'
                }`}
              />
            </span>
            <span className="text-gray-400 text-xs">
              Marcar como administrador (acesso ao painel)
            </span>
          </button>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-emerald-400 text-xs">{success}</p>}

          <button
            onClick={createUser}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-velvet-900 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <UserPlus size={16} />
            {saving ? 'Criando...' : 'Criar usuario'}
          </button>
        </div>
      </div>

      <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
        <Users size={16} className="text-gold-400" />
        Usuarios ({users.length})
      </h3>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <Users size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhum usuario encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="flex items-center justify-between gap-3 bg-velvet-800/40 border border-velvet-700/40 rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm truncate">{u.email}</p>
                  {u.is_admin && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      <ShieldCheck size={11} />
                      Admin
                    </span>
                  )}
                  {u.is_self && (
                    <span className="text-[10px] text-gray-500 flex-shrink-0">
                      (voce)
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs">Desde {formatDate(u.created_at)}</p>
              </div>

              {u.is_admin ? (
                <button
                  onClick={() => setAdmin(u, false)}
                  disabled={u.is_self || pendingId === u.user_id}
                  className="text-xs text-gray-400 hover:text-red-400 border border-velvet-700/50 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  title={
                    u.is_self
                      ? 'Voce nao pode remover o proprio acesso'
                      : 'Remover acesso de administrador'
                  }
                >
                  {pendingId === u.user_id ? '...' : 'Rebaixar'}
                </button>
              ) : (
                <button
                  onClick={() => setAdmin(u, true)}
                  disabled={pendingId === u.user_id}
                  className="text-xs text-velvet-900 bg-gold-400 hover:bg-gold-500 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Promover a administrador"
                >
                  {pendingId === u.user_id ? '...' : 'Promover'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
