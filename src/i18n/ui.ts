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

import { routeMap as routeMapRaw } from './routes.mjs';

const routeMapLocal: Record<string, string> = routeMapRaw;

export const defaultLang = 'es' as const;
export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;

// El mapa vive en routes.mjs para que tambien lo pueda importar astro.config.mjs
// (Node, pre-build, sin TypeScript). Una sola fuente para render, sitemap y gate.
export { routeMap } from './routes.mjs';

/**
 * Paginas EN con contraparte. DERIVADO del mapa, no escrito a mano.
 *
 * Antes eran dos registros manuales (`routeMap` = el plan, `EN_LIVE` = el hecho) y
 * mantenerlos sincronizados dependia de que nadie se olvidara. Ahora el mapa es la
 * unica fuente, y quien verifica que sea cierto es `scripts/check-i18n-routes.mjs`:
 * corre en `prebuild` y ROMPE el build si una ruta del mapa no tiene pagina en disco
 * (o al reves). El guard se movio de runtime a build — falla ruidosa antes de
 * publicar, en vez de hreflang a 404 sirviendose en produccion.
 */
export const EN_LIVE = new Set<string>(Object.values(routeMapLocal));

/** Inverso derivado — no se escribe a mano para que no pueda desincronizarse. */
export const routeMapInverse: Record<string, string> = Object.fromEntries(
  Object.entries(routeMapLocal).map(([es, en]) => [en, es]),
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
    const en = routeMapLocal[p];
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
    'nav.closeMenu': 'Cerrar menú',
    'nav.primary': 'Principal',
    'nav.langLabel': 'Cambiar idioma',
    'nav.langFallback': 'English \u2014 ir al inicio; esta p\u00e1gina no est\u00e1 traducida',
    'nav.langFallbackShort': 'English \u00b7 inicio',
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
    'nav.closeMenu': 'Close menu',
    'nav.primary': 'Primary',
    'nav.langLabel': 'Change language',
    'nav.langFallback': 'Espa\u00f1ol \u2014 go to the home page; this page is not translated',
    'nav.langFallbackShort': 'Espa\u00f1ol \u00b7 home',
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
    'sector.relevamiento': 'Aerial Survey & Terrain Modeling',
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
    const en = routeMapLocal[esPath];
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
