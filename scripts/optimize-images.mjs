// Optimiza fotos grandes en public/img/.
// - Resize max 1920px ancho
// - PNG-fotos -> JPG q=82 (transparencia no necesaria)
// - Genera .webp sibling q=80
// - Originales movidos a public/img/_raw/ como respaldo
//
// Idempotente: re-correr siempre comprime desde el ORIGINAL en _raw/,
// nunca desde la salida ya optimizada (evita degradar lossy sobre lossy).
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

// Busca el respaldo del original por base name (sin importar la extension
// actual en public/img/). Asi en re-runs se procesa siempre desde el
// archivo crudo, aunque el output haya cambiado de PNG a JPG.
async function findBackupByBaseName(rawFiles, baseName) {
  for (const candidate of rawFiles) {
    if (parse(candidate).name === baseName) return join(RAW_DIR, candidate);
  }
  return null;
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  const rawFiles = await readdir(RAW_DIR).catch(() => []);
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

    // 1. Resolver el archivo fuente: si ya hay backup por base name lo usamos
    //    como original. Si no, movemos el actual a _raw/ y ese pasa a ser
    //    el original "intocable" para futuras corridas.
    let backup = await findBackupByBaseName(rawFiles, name);
    if (!backup) {
      backup = join(RAW_DIR, file);
      await rename(src, backup);
      rawFiles.push(file);
    }

    // 2. Decidir formato de salida segun el ORIGINAL en _raw/, no el actual.
    const origExt = parse(backup).ext.toLowerCase();
    const origFile = parse(backup).base;
    const isPngPhoto = PNG_PHOTOS.has(origFile);
    const outExt = isPngPhoto ? '.jpg' : (origExt === '.jpeg' ? '.jpg' : origExt);
    const outName = name + outExt;
    const outPath = join(SRC_DIR, outName);
    const webpPath = join(SRC_DIR, `${name}.webp`);

    const pipeline = sharp(backup)
      .rotate() // aplica EXIF orientation antes de procesar; evita fotos rotadas
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
