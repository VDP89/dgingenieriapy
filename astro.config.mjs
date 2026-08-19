// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { pairFor, toUrl } from './src/i18n/routes.mjs';

export default defineConfig({
  site: 'https://dgingenieriapy.com',

  // i18n (S5, 2026-08-19) — `es` en la raiz sin prefijo, `en` bajo /en/.
  // Los slugs en ingles NO son espejo: son la keyword en ingles (ver src/i18n/routes.mjs).
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      /**
       * `serialize` en vez de la opcion `i18n` generica.
       *
       * La integracion generica supone que el pathname es IDENTICO en los dos idiomas y
       * solo cambia el prefijo de locale. Aca los slugs estan traducidos
       * (/sectores/urbanizaciones <-> /en/sectors/land-development), asi que esa suposicion
       * no se cumple: solo emparejaba el unico par que si calzaba (/ con /en/) y dejaba
       * los otros 15 sin alternates. Con el mapa explicito, cada miembro del par declara
       * a los dos.
       */
      serialize(item) {
        const pair = pairFor(item.url);
        if (pair) {
          item.links = [
            { lang: 'es-PY', url: toUrl(pair.es) },
            { lang: 'en-US', url: toUrl(pair.en) },
          ];
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
