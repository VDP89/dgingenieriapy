// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dgingenieriapy.com',

  // i18n (S5, 2026-08-19) — `es` en la raiz sin prefijo, `en` bajo /en/.
  // Los slugs en ingles NO son espejo: son la keyword en ingles (ver src/i18n/ui.ts).
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      // hreflang en el sitemap. El <head> tambien lo emite (Base.astro), pero solo
      // para las paginas con contraparte real; aca Astro lo deriva del arbol de rutas.
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-PY',
          en: 'en-US',
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
