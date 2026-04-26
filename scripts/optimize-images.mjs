// Optimiza fotos grandes en public/img/.
// - Resize max 1920px ancho
// - PNG-fotos -> JPG q=82 (transparencia no necesaria)
// - Genera .webp sibling q=80
// - Originales movidos a public/img/_raw/ como respaldo
//
// Uso: node scripts/optimize-images.mjs

import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/img';
const RAW_DIR = 'public/img/_raw';
const MAX_WIDTH = 1920;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 80;

// Solo fotos. Logos / isotipos / favicons quedan intactos.
const SKIP = new Set([
  'dg-isotipo.png',
  'dg-blanco.png',
  'dg-infra.png',
]);

// PNGs que son fotos (sin transparencia real) -> convertir a JPG
const PNG_PHOTOS = new Set([
  'sector-civil.png',
  'sector-pav.png',
  'sector-solar.png',
]);

const fmt = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  const files = await readdir(SRC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    if (SKIP.has(file)) continue;
    const src = join(SRC_DIR, file);
    const s = await stat(src);
    if (!s.isFile()) continue;
    const { name, ext } = parse(file);
    const lower = ext.toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(lower)) continue;

    totalBefore += s.size;

    // 1. Backup original
    const backup = join(RAW_DIR, file);
    try { await stat(backup); } catch { await rename(src, backup); }

    // 2. Decidir formato de salida
    const isPngPhoto = PNG_PHOTOS.has(file);
    const outExt = isPngPhoto ? '.jpg' : (lower === '.jpeg' ? '.jpg' : lower);
    const outName = name + outExt;
    const outPath = join(SRC_DIR, outName);
    const webpPath = join(SRC_DIR, `${name}.webp`);

    const pipeline = sharp(backup)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true });

    // Re-encode al formato destino
    if (outExt === '.jpg') {
      await pipeline.clone().jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(outPath);
    } else {
      await pipeline.clone().png({ compressionLevel: 9, palette: true }).toFile(outPath);
    }

    // WebP sibling
    await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    const sNew = await stat(outPath);
    const sWebp = await stat(webpPath);
    totalAfter += sNew.size + sWebp.size;

    console.log(`  ${file.padEnd(28)} ${fmt(s.size).padStart(10)} -> ${outName.padEnd(28)} ${fmt(sNew.size).padStart(10)}  + ${name}.webp ${fmt(sWebp.size)}`);
  }

  console.log(`\nTotal: ${fmt(totalBefore)} -> ${fmt(totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% smaller)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
