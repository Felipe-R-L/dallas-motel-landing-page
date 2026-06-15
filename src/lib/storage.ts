import { supabase } from './supabase';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/**
 * Faz upload de uma imagem para o bucket informado, validando tipo e tamanho.
 * Retorna a URL publica. Lanca Error com mensagem amigavel em caso de falha.
 */
export async function uploadImage(bucket: string, file: File): Promise<string> {
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    throw new Error('Formato invalido. Envie uma imagem JPG, PNG, WEBP, GIF ou AVIF.');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Imagem muito grande. O limite e de 5 MB.');
  }

  const rand = Math.random().toString(36).slice(2, 10);
  const fileName = `${Date.now()}-${rand}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error || !data) {
    throw new Error('Erro ao enviar imagem. Tente novamente.');
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
