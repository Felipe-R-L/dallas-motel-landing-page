import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Package, Tag, ArrowLeft, Lock, BedDouble, CalendarDays, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminSuites from '../components/admin/AdminSuites';
import AdminHolidays from '../components/admin/AdminHolidays';
import AdminUsers from '../components/admin/AdminUsers';
import Spinner from '../components/ui/Spinner';

export default function Admin() {
  const { user, loading, signIn, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'suites' | 'holidays' | 'users'
  >('products');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    document.title = 'Painel Admin | Dallas Motel';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const { error } = await signIn(email, password);
    if (error) setLoginError('Credenciais invalidas. Tente novamente.');
    setLoginLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-velvet-950 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-velvet-950 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-velvet-800 border border-velvet-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-gold-400" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-white">
              Painel Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Dallas Motel - Cardapio Digital
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="admin@dallas.com"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gold-400 hover:bg-gold-500 text-velvet-900 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50"
            >
              {loginLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-velvet-950 text-white min-h-screen">
      <div className="bg-velvet-900/80 border-b border-velvet-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-playfair text-lg font-bold text-gold-400">
              Painel Admin
            </h1>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      <div className="border-b border-velvet-800/50">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Package size={16} />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Tag size={16} />
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('suites')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suites'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <BedDouble size={16} />
            Suites
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'holidays'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <CalendarDays size={16} />
            Feriados
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-gold-400 text-gold-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Users size={16} />
            Usuarios
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'suites' && <AdminSuites />}
        {activeTab === 'holidays' && <AdminHolidays />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}
