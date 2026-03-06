import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ImageOff, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MenuProduct, MenuCategory } from '../../types/database';
import ProductForm from './ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('menu_products')
        .select('*, menu_categories(name)')
        .order('sort_order'),
      supabase.from('menu_categories').select('*').order('sort_order'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const toggleAvailability = async (product: MenuProduct) => {
    const { error } = await supabase
      .from('menu_products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id);
    if (!error) fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    const { error } = await supabase
      .from('menu_products')
      .delete()
      .eq('id', id);
    if (!error) fetchData();
  };

  const handleEdit = (product: MenuProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    fetchData();
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{products.length} produto(s)</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-velvet-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <Package size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhum produto cadastrado.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
          >
            Adicionar primeiro produto
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 bg-velvet-800/40 border rounded-lg p-3 transition-all ${
                product.is_available
                  ? 'border-velvet-700/40'
                  : 'border-velvet-700/20 opacity-60'
              }`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-velvet-900/50 flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff size={18} className="text-velvet-700" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm font-medium truncate">
                    {product.name}
                  </h3>
                  {product.menu_categories?.name && (
                    <span className="text-[10px] text-gray-500 bg-velvet-700/40 px-2 py-0.5 rounded-full flex-shrink-0">
                      {product.menu_categories.name}
                    </span>
                  )}
                </div>
                <p className="text-gold-400 text-sm font-medium mt-0.5">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleAvailability(product)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    product.is_available ? 'bg-emerald-500/80' : 'bg-velvet-700'
                  }`}
                  title={product.is_available ? 'Disponivel' : 'Indisponivel'}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      product.is_available ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-gray-500 hover:text-gold-400 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
