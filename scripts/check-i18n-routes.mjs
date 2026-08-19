/**
 * Gate de i18n — corre en `prebuild` y ROMPE el build si el mapa de rutas y las paginas
 * en disco no coinciden exacto.
 *
 * Por que existe: hasta el 2026-08-19 habia DOS registros manuales — `routeMap` (el plan)
 * y `EN_LIVE` (el hecho) — y mantenerlos sincronizados a mano dependia de que nadie se
 * olvidara. Un olvido produce una de estas dos cosas, las dos silenciosas:
 *   - ruta en el mapa sin pagina  -> hreflang y sitemap apuntando a un 404
 *   - pagina sin ruta en el mapa  -> pagina huerfana, sin hreflang y sin selector de idioma
 *
 * Ahora el mapa es la unica fuente y este script es el que verifica que sea cierto.
 * Falla ruidosa antes del build en vez de defecto silencioso en produccion.
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeMap } from '../src/i18n/routes.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EN_DIR = join(ROOT, 'src', 'pages', 'en');
const ES_PAGES = join(ROOT, 'src', 'pages');

/** Todas las paginas .astro bajo un directorio, como rutas URL. */
function pagesUnder(dir, prefix) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.astro')) {
        const rel = relative(dir, full).split(sep).join('/');
        let route = prefix + '/' + rel.replace(/\.astro$/, '');
        route = route.replace(/\/index$/, '/');
        if (route !== prefix + '/' && route.endsWith('/')) route = route.slice(0, -1);
        out.push(route);
      }
    }
  };
  walk(dir);
  return out;
}

const enOnDisk = new Set(pagesUnder(EN_DIR, '/en'));
const enInMap = new Set(Object.values(routeMap));

const errors = [];

for (const route of enInMap) {
  if (!enOnDisk.has(route)) {
    errors.push(`  routeMap declara "${route}" pero no existe la pagina en src/pages/en/`);
  }
}
for (const route of enOnDisk) {
  if (!enInMap.has(route)) {
    errors.push(`  existe la pagina "${route}" pero no esta en routeMap (quedaria huerfana)`);
  }
}

// Las claves ES tambien tienen que existir como pagina.
for (const esRoute of Object.keys(routeMap)) {
  const base = esRoute === '/' ? 'index' : esRoute.slice(1);
  const candidates = [
    join(ES_PAGES, base + '.astro'),
    join(ES_PAGES, base, 'index.astro'),
  ];
  if (!candidates.some(existsSync)) {
    errors.push(`  routeMap declara la ruta ES "${esRoute}" pero no existe su pagina`);
  }
}

// Duplicados: dos rutas ES no pueden apuntar al mismo EN.
const seen = new Map();
for (const [es, en] of Object.entries(routeMap)) {
  if (seen.has(en)) errors.push(`  "${en}" esta mapeado desde "${seen.get(en)}" y desde "${es}"`);
  seen.set(en, es);
}

if (errors.length) {
  console.error('\n[check-i18n-routes] El mapa de rutas y las paginas en disco NO coinciden:\n');
  console.error(errors.join('\n'));
  console.error('\nCorregir src/i18n/routes.mjs o las paginas antes de buildear.\n');
  process.exit(1);
}

console.log(`[check-i18n-routes] OK — ${enInMap.size} pares ES/EN, todos con pagina en disco.`);
