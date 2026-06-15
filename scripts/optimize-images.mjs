// Otimiza as imagens em public/images: redimensiona e recomprime no lugar.
// Uso: node scripts/optimize-images.mjs  (ou: pnpm run optimize:images)
import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'public/images';

// Largura maxima por arquivo (fundos full-bleed maiores; cards menores).
const widthFor = (name) => {
  if (name.startsWith('feature-')) return 800;
  if (name.startsWith('legacy-')) return 1600;
  return 1920; // hero-*, menu-cta-*
};

const QUALITY = 72;

const run = async () => {
  const files = await readdir(DIR);
  for (const name of files) {
    const path = join(DIR, name);
    const before = (await stat(path)).size;
    const ext = name.toLowerCase().split('.').pop();
    const maxW = widthFor(name);

    const input = await readFile(path); // le tudo e libera o handle do arquivo
    const img = sharp(input).rotate();
    const meta = await img.metadata();
    const pipeline = img.resize({
      width: Math.min(maxW, meta.width ?? maxW),
      withoutEnlargement: true,
    });

    let out;
    if (ext === 'png') {
      out = await pipeline
        .png({ compressionLevel: 9, quality: QUALITY, palette: true })
        .toBuffer();
    } else {
      out = await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
        .toBuffer();
    }

    // Só sobrescreve se ficou menor.
    if (out.length < before) {
      await writeFile(path, out);
    }
    const after = (await stat(path)).size;
    const kb = (n) => (n / 1024).toFixed(0) + 'KB';
    console.log(
      `${name.padEnd(34)} ${kb(before).padStart(7)} -> ${kb(after).padStart(7)}`
    );
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
