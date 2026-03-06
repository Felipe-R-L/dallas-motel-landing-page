import { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { HolidayRow } from '../../types/database';

export default function AdminHolidays() {
  const [holidays, setHolidays] = useState<HolidayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const { data } = await supabase
      .from('holidays')
      .select('*')
      .order('date');
    if (data) setHolidays(data);
    setLoading(false);
  };

  const addHoliday = async () => {
    if (!newDate || !newName.trim()) {
      setError('Preencha a data e o nome do feriado.');
      return;
    }

    setSaving(true);
    setError('');

    const { error: dbError } = await supabase
      .from('holidays')
      .insert({ date: newDate, name: newName.trim() });

    if (dbError) {
      setError(
        dbError.code === '23505'
          ? 'Essa data ja esta cadastrada.'
          : 'Erro ao salvar feriado.'
      );
    } else {
      setNewDate('');
      setNewName('');
      fetchHolidays();
    }
    setSaving(false);
  };

  const removeHoliday = async (id: string) => {
    const { error: dbError } = await supabase
      .from('holidays')
      .delete()
      .eq('id', id);
    if (!dbError) fetchHolidays();
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const inputClass =
    'w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors';

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-velvet-800/40 border border-velvet-700/40 rounded-xl p-5 mb-6">
        <h3 className="text-white text-sm font-semibold mb-4">Adicionar Feriado</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className={`sm:w-48 ${inputClass}`}
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHoliday()}
            className={`flex-1 ${inputClass}`}
            placeholder="Ex: Natal, Ano Novo..."
          />
          <button
            onClick={addHoliday}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-velvet-900 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>

      <p className="text-gray-400 text-sm mb-4">{holidays.length} feriado(s)</p>

      {holidays.length === 0 ? (
        <div className="text-center py-16 bg-velvet-800/30 rounded-xl border border-velvet-700/30">
          <CalendarDays size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">Nenhum feriado cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between bg-velvet-800/40 border border-velvet-700/40 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-gold-400 font-mono text-sm font-medium min-w-[5.5rem]">
                  {formatDate(h.date)}
                </span>
                <span className="text-white text-sm">{h.name}</span>
              </div>
              <button
                onClick={() => removeHoliday(h.id)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
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
