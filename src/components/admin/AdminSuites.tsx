import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ImageOff, BedDouble, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SuiteRow } from '../../types/database';
import SuiteForm from './SuiteForm';

export default function AdminSuites() {
  const [suites, setSuites] = useState<SuiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSuite, setEditingSuite] = useState<SuiteRow | null>(null);

  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    const { data } = await supabase
      .from('suites')
      .select('*')
      .order('sort_order');
    if (data) setSuites(data);
    setLoading(false);
  };

  const toggleActive = async (suite: SuiteRow) => {
    const { error } = await supabase
      .from('suites')
      .update({ is_active: !suite.is_active })
      .eq('id', suite.id);
    if (!error) fetchSuites();
  };

  const deleteSuite = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta suite?')) return;
    const { error } = await supabase
      .from('suites')
      .delete()
      .eq('id', id);
    if (!error) fetchSuites();
  };

  const handleEdit = (suite: SuiteRow) => {
    setEditingSuite(suite);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSuite(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    fetchSuites();
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
        <p className="text-gray-400 text-sm">{suites.length} suite(s)</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-velvet-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Nova Suite
        </button>
      </div>

      {suites.length === 0 ? (
        <div className="text-center py-16 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <BedDouble size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhuma suite cadastrada.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
          >
            Adicionar primeira suite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suites.map((suite) => (
            <div
              key={suite.id}
              className={`bg-velvet-800/40 border rounded-xl overflow-hidden transition-all ${
                suite.is_active
                  ? 'border-velvet-700/40'
                  : 'border-velvet-700/20 opacity-60'
              }`}
            >
              <div className="relative h-40 bg-velvet-900/50">
                {suite.image_url ? (
                  <img
                    src={suite.image_url}
                    alt={suite.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff size={28} className="text-velvet-700" />
                  </div>
                )}
                {suite.is_featured && (
                  <div className="absolute top-3 right-3 bg-gold-400 text-velvet-900 p-1.5 rounded-full">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-white text-sm font-semibold">
                      {suite.name}
                    </h3>
                    {suite.description && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                        {suite.description}
                      </p>
                    )}
                  </div>
                  <span className="text-gold-400 text-sm font-bold whitespace-nowrap">
                    {formatPrice(suite.weekday_base_price)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-velvet-900/50 rounded-lg px-2.5 py-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">Base Semana</p>
                    <p className="text-white text-xs font-medium">
                      {formatPrice(suite.weekday_base_price)}
                    </p>
                  </div>
                  <div className="bg-velvet-900/50 rounded-lg px-2.5 py-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">Base Fim/Fer.</p>
                    <p className="text-white text-xs font-medium">
                      {formatPrice(suite.weekend_base_price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-velvet-900/50 rounded-lg px-2.5 py-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">+Hora Sem.</p>
                    <p className="text-white text-xs font-medium">
                      {formatPrice(suite.weekday_hourly_rate)}/h
                    </p>
                  </div>
                  <div className="bg-velvet-900/50 rounded-lg px-2.5 py-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">+Hora Fim.</p>
                    <p className="text-white text-xs font-medium">
                      {formatPrice(suite.weekend_hourly_rate)}/h
                    </p>
                  </div>
                  <div className="bg-velvet-900/50 rounded-lg px-2.5 py-2 text-center">
                    <p className="text-[10px] text-gray-500 mb-0.5">+Hora Fer.</p>
                    <p className="text-white text-xs font-medium">
                      {formatPrice(suite.holiday_hourly_rate)}/h
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-velvet-700/30">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Min. {suite.min_stay_hours}h</span>
                    {suite.amenities.length > 0 && (
                      <>
                        <span className="text-velvet-700">|</span>
                        <span>{suite.amenities.length} comodidade(s)</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleActive(suite)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        suite.is_active ? 'bg-emerald-500/80' : 'bg-velvet-700'
                      }`}
                      title={suite.is_active ? 'Ativa' : 'Inativa'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          suite.is_active ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleEdit(suite)}
                      className="p-2 text-gray-500 hover:text-gold-400 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteSuite(suite.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SuiteForm
          suite={editingSuite}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
