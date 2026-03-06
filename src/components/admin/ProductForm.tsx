import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MenuProduct, MenuCategory } from '../../types/database';

interface ProductFormProps {
  product: MenuProduct | null;
  categories: MenuCategory[];
  onClose: () => void;
  onSave: () => void;
}

export default function ProductForm({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError('Erro ao enviar imagem.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!name.trim() || !price) {
      setError('Nome e preco sao obrigatorios.');
      return;
    }

    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Preco invalido.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      image_url: imageUrl,
      category_id: categoryId || null,
    };

    const { error: dbError } = product
      ? await supabase
          .from('menu_products')
          .update(payload)
          .eq('id', product.id)
      : await supabase.from('menu_products').insert(payload);

    if (dbError) {
      setError('Erro ao salvar produto.');
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-velvet-900 border border-velvet-700/50 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-velvet-800/50">
          <h2 className="font-playfair text-lg font-bold text-white">
            {product ? 'Editar Produto' : 'Novo Produto'}
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
            <label className="block text-gray-400 text-xs mb-1.5">
              Imagem
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative h-36 bg-velvet-800/60 border border-velvet-700/50 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-gold-400/40 transition-colors"
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
                      <span className="text-xs">Clique para enviar</span>
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
            <label className="block text-gray-400 text-xs mb-1.5">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors"
              placeholder="Nome do produto"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Descricao
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
              placeholder="Descricao opcional"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Preco (R$) *
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-colors"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-velvet-800/60 border border-velvet-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

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
