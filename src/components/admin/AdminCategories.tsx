import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MenuCategory } from '../../types/database';
import Spinner from '../ui/Spinner';

export default function AdminCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order');
    if (error) setActionError('Erro ao carregar as categorias.');
    if (data) setCategories(data);
    setLoading(false);
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    setActionError('');
    const { error } = await supabase
      .from('menu_categories')
      .insert({ name: newName.trim(), sort_order: categories.length });
    if (error) {
      setActionError(
        error.code === '23505'
          ? 'Ja existe uma categoria com esse nome.'
          : 'Erro ao adicionar a categoria.'
      );
      return;
    }
    setNewName('');
    fetchCategories();
  };

  const updateCategory = async (id: string) => {
    if (!editingName.trim()) return;
    setActionError('');
    const { error } = await supabase
      .from('menu_categories')
      .update({ name: editingName.trim() })
      .eq('id', id);
    if (error) {
      setActionError(
        error.code === '23505'
          ? 'Ja existe uma categoria com esse nome.'
          : 'Erro ao atualizar a categoria.'
      );
      return;
    }
    setEditingId(null);
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Excluir esta categoria? Produtos nela ficarao sem categoria.'))
      return;
    setActionError('');
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    if (error) {
      setActionError('Erro ao excluir a categoria.');
      return;
    }
    fetchCategories();
  };

  const startEdit = (cat: MenuCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      {actionError && (
        <p className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {actionError}
        </p>
      )}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          placeholder="Nova categoria..."
          className="flex-1 bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors"
        />
        <button
          onClick={addCategory}
          disabled={!newName.trim()}
          className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-velvet-900 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <Tag size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhuma categoria criada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 bg-velvet-800/40 border border-velvet-700/40 rounded-lg px-4 py-3"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && updateCategory(cat.id)
                    }
                    className="flex-1 bg-velvet-900/60 border border-velvet-600/50 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold-400/50"
                    autoFocus
                  />
                  <button
                    onClick={() => updateCategory(cat.id)}
                    aria-label="Salvar categoria"
                    className="p-1.5 text-emerald-400 hover:text-emerald-300"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    aria-label="Cancelar edição"
                    className="p-1.5 text-gray-500 hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-white text-sm">{cat.name}</span>
                  <button
                    onClick={() => startEdit(cat)}
                    aria-label={`Editar ${cat.name}`}
                    className="p-1.5 text-gray-500 hover:text-gold-400 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    aria-label={`Excluir ${cat.name}`}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
