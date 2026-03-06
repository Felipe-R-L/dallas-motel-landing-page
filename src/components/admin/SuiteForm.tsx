import { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SuiteRow } from '../../types/database';

interface SuiteFormProps {
  suite: SuiteRow | null;
  onClose: () => void;
  onSave: () => void;
}

export default function SuiteForm({ suite, onClose, onSave }: SuiteFormProps) {
  const [name, setName] = useState(suite?.name ?? '');
  const [description, setDescription] = useState(suite?.description ?? '');
  const [imageUrl, setImageUrl] = useState(suite?.image_url ?? '');
  const [weekdayBasePrice, setWeekdayBasePrice] = useState(
    suite?.weekday_base_price?.toString() ?? ''
  );
  const [weekendBasePrice, setWeekendBasePrice] = useState(
    suite?.weekend_base_price?.toString() ?? ''
  );
  const [minStayHours, setMinStayHours] = useState(
    suite?.min_stay_hours?.toString() ?? '2'
  );
  const [weekdayRate, setWeekdayRate] = useState(
    suite?.weekday_hourly_rate?.toString() ?? ''
  );
  const [weekendRate, setWeekendRate] = useState(
    suite?.weekend_hourly_rate?.toString() ?? ''
  );
  const [holidayRate, setHolidayRate] = useState(
    suite?.holiday_hourly_rate?.toString() ?? ''
  );
  const [isFeatured, setIsFeatured] = useState(suite?.is_featured ?? false);
  const [amenities, setAmenities] = useState<string[]>(suite?.amenities ?? []);
  const [newAmenity, setNewAmenity] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const parseNumber = (val: string) => parseFloat(val.replace(',', '.'));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('suite-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError('Erro ao enviar imagem.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('suite-images')
      .getPublicUrl(data.path);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
  };

  const addAmenity = () => {
    const trimmed = newAmenity.trim();
    if (!trimmed || amenities.includes(trimmed)) return;
    setAmenities([...amenities, trimmed]);
    setNewAmenity('');
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nome e obrigatorio.');
      return;
    }

    const parsedWeekdayBase = parseNumber(weekdayBasePrice);
    const parsedWeekendBase = parseNumber(weekendBasePrice);
    const parsedMinStay = parseInt(minStayHours, 10);
    const parsedWeekday = parseNumber(weekdayRate);
    const parsedWeekend = parseNumber(weekendRate);
    const parsedHoliday = parseNumber(holidayRate);

    if (isNaN(parsedWeekdayBase) || parsedWeekdayBase < 0) {
      setError('Preco base (semana) invalido.');
      return;
    }
    if (isNaN(parsedWeekendBase) || parsedWeekendBase < 0) {
      setError('Preco base (fim de semana) invalido.');
      return;
    }
    if (isNaN(parsedMinStay) || parsedMinStay < 1) {
      setError('Periodo minimo invalido.');
      return;
    }
    if (isNaN(parsedWeekday) || parsedWeekday < 0) {
      setError('Tarifa de dia de semana invalida.');
      return;
    }
    if (isNaN(parsedWeekend) || parsedWeekend < 0) {
      setError('Tarifa de fim de semana invalida.');
      return;
    }
    if (isNaN(parsedHoliday) || parsedHoliday < 0) {
      setError('Tarifa de feriado invalida.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image_url: imageUrl,
      amenities,
      weekday_base_price: parsedWeekdayBase,
      weekend_base_price: parsedWeekendBase,
      base_price: parsedWeekdayBase,
      min_stay_hours: parsedMinStay,
      weekday_hourly_rate: parsedWeekday,
      weekend_hourly_rate: parsedWeekend,
      holiday_hourly_rate: parsedHoliday,
      is_featured: isFeatured,
    };

    const { error: dbError } = suite
      ? await supabase.from('suites').update(payload).eq('id', suite.id)
      : await supabase.from('suites').insert(payload);

    if (dbError) {
      setError('Erro ao salvar suite.');
      setSaving(false);
      return;
    }

    onSave();
  };

  const inputClass =
    'w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors';
  const labelClass = 'block text-gray-400 text-xs mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-velvet-900 border border-velvet-700/50 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-velvet-800/50">
          <h2 className="font-playfair text-lg font-bold text-white">
            {suite ? 'Editar Suite' : 'Nova Suite'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Banner</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative h-44 bg-velvet-800/60 border border-velvet-700/50 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-gold-400/40 transition-colors"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs">Clique para enviar imagem</span>
                    </>
                  )}
                </div>
              )}
              {imageUrl && !uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          <div>
            <label className={labelClass}>Nome *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Ex: Suite Hidromassagem"
            />
          </div>

          <div>
            <label className={labelClass}>Descricao</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Descricao da suite"
            />
          </div>

          <div>
            <label className={labelClass}>{`Pre\u00E7os Base (R$) *`}</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">Semana</span>
                <input
                  type="text"
                  value={weekdayBasePrice}
                  onChange={(e) => setWeekdayBasePrice(e.target.value)}
                  className={inputClass}
                  placeholder="0,00"
                />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">Fim de Sem./Feriado</span>
                <input
                  type="text"
                  value={weekendBasePrice}
                  onChange={(e) => setWeekendBasePrice(e.target.value)}
                  className={inputClass}
                  placeholder="0,00"
                />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">{`Per\u00EDodo M\u00EDn. (h)`}</span>
                <input
                  type="number"
                  value={minStayHours}
                  onChange={(e) => setMinStayHours(e.target.value)}
                  min="1"
                  className={inputClass}
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tarifas de Hora Adicional (R$) *</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">
                  Dia de Semana
                </span>
                <input
                  type="text"
                  value={weekdayRate}
                  onChange={(e) => setWeekdayRate(e.target.value)}
                  className={inputClass}
                  placeholder="0,00"
                />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">
                  Fim de Semana
                </span>
                <input
                  type="text"
                  value={weekendRate}
                  onChange={(e) => setWeekendRate(e.target.value)}
                  className={inputClass}
                  placeholder="0,00"
                />
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 mb-1">
                  Feriado
                </span>
                <input
                  type="text"
                  value={holidayRate}
                  onChange={(e) => setHolidayRate(e.target.value)}
                  className={inputClass}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Comodidades</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                className={`flex-1 ${inputClass}`}
                placeholder="Ex: Ar-condicionado"
              />
              <button
                type="button"
                onClick={addAmenity}
                disabled={!newAmenity.trim()}
                className="p-2.5 bg-velvet-700/60 hover:bg-velvet-600/60 text-gray-300 rounded-lg transition-colors disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-velvet-700/50 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(i)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                isFeatured ? 'bg-gold-400' : 'bg-velvet-700'
              }`}
              onClick={() => setIsFeatured(!isFeatured)}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  isFeatured ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
            <span className="text-gray-400 text-xs">Destacar esta suite</span>
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        <div className="flex gap-3 p-5 border-t border-velvet-800/50">
          <button
            onClick={onClose}
            className="flex-1 bg-velvet-800/60 hover:bg-velvet-700/60 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gold-400 hover:bg-gold-500 text-velvet-900 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
