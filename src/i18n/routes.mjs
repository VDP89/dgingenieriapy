/**
 * Mapa canonico de rutas ES -> EN. UNICA fuente de verdad.
 *
 * Vive en .mjs y no en el ui.ts para que lo puedan importar los DOS lados:
 * `astro.config.mjs` (que corre en Node, antes del build, y no puede leer TypeScript)
 * y `src/i18n/ui.ts` (que corre en el render). Antes el mapa vivia solo del lado del
 * frontend, y por eso el sitemap no sabia emparejar los slugs traducidos.
 *
 * Los slugs EN no son transliteracion: son la keyword en ingles. La web en ingles es
 * canal de adquisicion, no espejo de cortesia.
 *
 * REGLA: aca solo entran pares que existen de los dos lados. `scripts/check-i18n-routes.mjs`
 * corre en `prebuild` y rompe el build si el mapa y `src/pages/en/**` no coinciden exacto.
 */
export const routeMap = {
  '/': '/en/',
  '/nosotros': '/en/about',
  '/sectores': '/en/sectors',
  '/sectores/vialidad': '/en/sectors/roads-and-highways',
  '/sectores/pavimentos': '/en/sectors/pavement-engineering',
  '/sectores/aeropuertos': '/en/sectors/airports-and-runways',
  '/sectores/puertos': '/en/sectors/ports-and-waterways',
  '/sectores/fiscalizacion': '/en/sectors/residential-development',
  '/sectores/plantas-industriales': '/en/sectors/industrial-plants',
  '/sectores/urbanizaciones': '/en/sectors/land-development',
  '/sectores/solar': '/en/sectors/solar-and-data-centers',
  '/sectores/relevamiento-aereo': '/en/sectors/aerial-survey-and-terrain-modelling',
  '/proyectos': '/en/projects',
  '/soluciones-ia': '/en/ai-solutions',
  '/blog': '/en/insights',
  '/contacto': '/en/contact',
  '/blog/energia-paraguay-lo-que-la-tarifa-no-dice':
    '/en/insights/paraguay-energy-what-the-tariff-does-not-tell-you',
  '/blog/fiscalizacion-con-visibilidad':
    '/en/insights/construction-supervision-with-real-visibility',
  '/blog/ia-en-produccion-experiencia-ingenieria':
    '/en/insights/reducing-risk-when-preparing-a-bid',
};

export const SITE = 'https://dgingenieriapy.com';

/** Normaliza una URL absoluta o un path a un path sin barra final (salvo la raiz). */
export function toPath(urlOrPath) {
  const p = urlOrPath.startsWith('http') ? new URL(urlOrPath).pathname : urlOrPath;
  if (p === '/' || p === '/en/') return p;
  return p.replace(/\/+$/, '');
}

/** URL absoluta con barra final, que es el formato que emite el sitemap de Astro. */
export function toUrl(path) {
  const p = path.endsWith('/') ? path : path + '/';
  return SITE + p;
}

/** Par {es, en} de un path cualquiera, o null si esa pagina no esta emparejada. */
export function pairFor(urlOrPath) {
  const p = toPath(urlOrPath);
  if (routeMap[p]) return { es: p, en: routeMap[p] };
  const es = Object.keys(routeMap).find((k) => routeMap[k] === p);
  return es ? { es, en: p } : null;
}
