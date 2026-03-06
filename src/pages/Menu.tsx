import { useState, useEffect } from 'react';
import { ArrowLeft, Search, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { MenuCategory, MenuProduct } from '../types/database';
import ProductCard from '../components/menu/ProductCard';

export default function Menu() {
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('menu_products')
        .select('*, menu_categories(name)')
        .eq('is_available', true)
        .order('sort_order'),
      supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const filtered = products.filter((p) => {
    const matchesCategory =
      !selectedCategory || p.category_id === selectedCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-velvet-950 text-white min-h-screen">
      <div className="sticky top-0 z-50 bg-velvet-950/95 backdrop-blur-md border-b border-velvet-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-playfair text-xl font-bold text-gold-400">
              Dallas Motel
            </h1>
            <p className="text-xs text-gray-500">Cardapio Digital</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-400/50 transition-colors"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-gold-400 text-velvet-900'
                  : 'bg-velvet-800/60 text-gray-400 hover:text-white border border-velvet-700/50'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gold-400 text-velvet-900'
                    : 'bg-velvet-800/60 text-gray-400 hover:text-white border border-velvet-700/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <UtensilsCrossed size={40} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500">
              {search
                ? 'Nenhum produto encontrado.'
                : 'Nenhum produto disponivel no momento.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
