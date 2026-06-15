import { useState, useEffect } from 'react';
import { UserPlus, Trash2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Spinner from '../ui/Spinner';

type AdminUser = {
  user_id: string;
  email: string;
  created_at: string;
};

type FnResponse = { ok?: boolean; error?: string; admins?: AdminUser[] };

async function callAdminFn(body: Record<string, unknown>): Promise<FnResponse> {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    body,
  });
  if (error) return { error: 'Falha de conexao com o servidor.' };
  return data as FnResponse;
}

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [makeAdmin, setMakeAdmin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await callAdminFn({ action: 'list' });
    if (res.error) setError(res.error);
    else setAdmins(res.admins ?? []);
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
    fetchAdmins();
  };

  const removeAdmin = async (userId: string, userEmail: string) => {
    if (
      !confirm(
        `Remover o acesso de administrador de ${userEmail}? O login continua existindo, mas perde o acesso ao painel.`
      )
    )
      return;

    setError('');
    setSuccess('');
    const res = await callAdminFn({ action: 'remove_admin', user_id: userId });
    if (res.error) {
      setError(res.error);
      return;
    }
    fetchAdmins();
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
        <ShieldCheck size={16} className="text-gold-400" />
        Administradores ({admins.length})
      </h3>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <ShieldCheck size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhum administrador encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((a) => (
            <div
              key={a.user_id}
              className="flex items-center justify-between bg-velvet-800/40 border border-velvet-700/40 rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{a.email}</p>
                <p className="text-gray-500 text-xs">
                  Desde {formatDate(a.created_at)}
                </p>
              </div>
              <button
                onClick={() => removeAdmin(a.user_id, a.email)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                title="Remover acesso de administrador"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
