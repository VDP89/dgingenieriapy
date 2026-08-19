/**
 * i18n — fuente unica de verdad de rutas y strings de chrome (nav, footer, CTA).
 *
 * Decisiones (S5, 2026-08-19):
 * - `es` es el idioma por defecto y vive en la raiz (sin prefijo). `en` vive bajo /en/.
 * - Los slugs en ingles NO son transliteracion: son la keyword en ingles. La web en ingles
 *   es canal de adquisicion, no espejo de cortesia.
 * - El contenido de las paginas NO vive aca. Aca vive solo el chrome compartido y el mapa
 *   de rutas que alimenta hreflang y el selector de idioma.
 */

export const defaultLang = 'es' as const;
export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;

/**
 * Mapa canonico ES -> EN. Toda ruta traducida vive aca y en ningun otro lado.
 * Si una pagina no figura, no tiene contraparte: no se emite hreflang para ella.
 */
export const routeMap: Record<string, string> = {
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
};

/**
 * Paginas EN REALMENTE construidas. `routeMap` es el PLAN; esto es el HECHO.
 *
 * Por que existen las dos listas: un hreflang que apunta a una pagina que todavia no
 * existe manda al buscador a un 404, y eso es peor que no emitir hreflang. El mapa se
 * escribe entero de una vez (es el diseño de rutas); esta lista crece solo cuando el
 * archivo .astro correspondiente esta en disco.
 *
 * Al 2026-08-19 estan las 16. La lista NO se borra: sigue siendo el guard para la
 * proxima ruta que alguien agregue al mapa antes de escribir la pagina.
 */
export const EN_LIVE = new Set<string>([
  '/en/',
  '/en/about',
  '/en/sectors',
  '/en/sectors/roads-and-highways',
  '/en/sectors/pavement-engineering',
  '/en/sectors/airports-and-runways',
  '/en/sectors/ports-and-waterways',
  '/en/sectors/residential-development',
  '/en/sectors/industrial-plants',
  '/en/sectors/land-development',
  '/en/sectors/solar-and-data-centers',
  '/en/sectors/aerial-survey-and-terrain-modelling',
  '/en/projects',
  '/en/ai-solutions',
  '/en/insights',
  '/en/contact',
]);

/** Inverso derivado — no se escribe a mano para que no pueda desincronizarse. */
export const routeMapInverse: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([es, en]) => [en, es]),
);

/** Normaliza para que '/sectores/' y '/sectores' sean la misma clave. */
function normalize(path: string): string {
  if (path === '/' || path === '/en/') return path;
  return path.replace(/\/+$/, '');
}

/** Idioma de una ruta, deducido del prefijo. */
export function langFromPath(path: string): Lang {
  return path === '/en' || path === '/en/' || path.startsWith('/en/') ? 'en' : 'es';
}

/**
 * Contraparte en el otro idioma, o null si esta pagina no esta traducida.
 * Devolver null es deliberado: un hreflang que apunta a una pagina inexistente
 * es peor que no emitir hreflang.
 */
export function counterpart(path: string): string | null {
  const p = normalize(path);
  if (langFromPath(p) === 'es') {
    const en = routeMap[p];
    // El gate: si la pagina EN todavia no existe, no hay contraparte que ofrecer.
    return en && EN_LIVE.has(en) ? en : null;
  }
  const enKey = p === '/en' ? '/en/' : p;
  return routeMapInverse[enKey] ?? null;
}

/**
 * Destino del SELECTOR de idioma. Distinto de `counterpart()` a proposito.
 *
 * `counterpart()` alimenta el hreflang y debe devolver null cuando no hay pagina
 * equivalente: declararle al buscador que un articulo tiene traduccion cuando no la
 * tiene es una señal falsa. El selector, en cambio, es navegacion humana: si no hay
 * equivalente (caso de los articulos publicados solo en español), lleva al home del
 * otro idioma en vez de desaparecer y dejar al lector sin salida.
 */
export function switchTarget(path: string): string {
  return counterpart(path) ?? (langFromPath(path) === 'es' ? '/en/' : '/');
}

/** Strings de chrome. Solo lo compartido por todas las paginas. */
export const ui = {
  es: {
    'nav.about': 'Nosotros',
    'nav.sectors': 'Sectores',
    'nav.projects': 'Proyectos',
    'nav.ai': 'Soluciones IA',
    'nav.insights': 'Insights',
    'nav.contact': 'Contacto',
    'nav.openMenu': 'Abrir menú',
    'nav.primary': 'Principal',
    'nav.langLabel': 'Cambiar idioma',
    'a11y.skip': 'Saltar al contenido',
    'tagline': 'Infraestructura Inteligente',
    'sticky.question': '¿Tiene un proyecto de infraestructura?',
    'sticky.cta': 'Hablemos',
    'footer.brandLine': 'Ingeniería aplicada a infraestructura.<br>Asunción, Paraguay.',
    'footer.sectors': 'Sectores',
    'footer.company': 'Empresa',
    'footer.contact': 'Contacto',
    'footer.hours': 'Asunción, Paraguay<br>Atención L-V 08:30 — 18:00',
    'footer.rights': '© 2026 DG Ingeniería SRL — Todos los derechos reservados',
    'footer.claim': 'Claridad técnica en cada decisión de proyecto',
    'sector.vialidad': 'Proyectos Viales',
    'sector.pavimentos': 'Pavimentos',
    'sector.aeropuertos': 'Aeropuertos y Pistas',
    'sector.puertos': 'Puertos y Fluvial',
    'sector.fiscalizacion': 'Edificación Residencial',
    'sector.plantas': 'Plantas Industriales',
    'sector.urbanizaciones': 'Urbanizaciones',
    'sector.solar': 'Solar y Data Centers',
    'sector.relevamiento': 'Relevamiento Aéreo y MDT',
  },
  en: {
    'nav.about': 'About',
    'nav.sectors': 'Sectors',
    'nav.projects': 'Projects',
    'nav.ai': 'AI Solutions',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'nav.openMenu': 'Open menu',
    'nav.primary': 'Primary',
    'nav.langLabel': 'Change language',
    'a11y.skip': 'Skip to content',
    'tagline': 'Engineering Intelligence',
    'sticky.question': 'Planning infrastructure in Paraguay?',
    'sticky.cta': "Let's talk",
    'footer.brandLine': 'Civil engineering for infrastructure.<br>Asunción, Paraguay.',
    'footer.sectors': 'Sectors',
    'footer.company': 'Company',
    'footer.contact': 'Contact',
    'footer.hours': 'Asunción, Paraguay<br>Mon-Fri 08:30 — 18:00 (UTC-3)',
    'footer.rights': '© 2026 DG Ingeniería SRL — All rights reserved',
    'footer.claim': 'Technical clarity for every project decision',
    'sector.vialidad': 'Roads & Highways',
    'sector.pavimentos': 'Pavement Engineering',
    'sector.aeropuertos': 'Airports & Runways',
    'sector.puertos': 'Ports & Waterways',
    'sector.fiscalizacion': 'Residential Development',
    'sector.plantas': 'Industrial Plants',
    'sector.urbanizaciones': 'Land Development',
    'sector.solar': 'Solar & Data Centers',
    'sector.relevamiento': 'Aerial Survey & Terrain Modelling',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

export function t(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/**
 * Rutas del chrome por idioma, para que nav y footer no hardcodeen paths.
 *
 * FALLBACK DELIBERADO: si la pagina EN todavia no existe, el link va al ES.
 * Sin esto, la web en ingles enlaza a rutas planificadas-pero-no-construidas y cada
 * item del nav da 404 — una web rota es peor que una web a medio traducir. El fallback
 * se apaga solo: en cuanto la pagina entra en EN_LIVE, el link salta al ingles.
 */
export function nav(lang: Lang) {
  const p = (esPath: string) => {
    if (lang === 'es') return esPath;
    const en = routeMap[esPath];
    return en && EN_LIVE.has(en) ? en : esPath;
  };
  return {
    home: p('/'),
    about: p('/nosotros'),
    sectors: p('/sectores'),
    projects: p('/proyectos'),
    ai: p('/soluciones-ia'),
    insights: p('/blog'),
    contact: p('/contacto'),
    vialidad: p('/sectores/vialidad'),
    pavimentos: p('/sectores/pavimentos'),
    aeropuertos: p('/sectores/aeropuertos'),
    puertos: p('/sectores/puertos'),
    fiscalizacion: p('/sectores/fiscalizacion'),
    plantas: p('/sectores/plantas-industriales'),
    urbanizaciones: p('/sectores/urbanizaciones'),
    solar: p('/sectores/solar'),
    relevamiento: p('/sectores/relevamiento-aereo'),
  };
}
