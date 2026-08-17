// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Replace with the real Netlify URL once the site is claimed; canonical tags
  // and the sitemap are both generated from this.
  site: 'https://nexio-estates.netlify.app',

  // Static output. Netlify needs no adapter for a fully prerendered site, and a
  // static build is also what lets Netlify Forms detect the contact form at deploy.
  output: 'static',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // `/` is Spanish, `/en/` is English.
      prefixDefaultLocale: false,
    },
  },

  // Preload same-origin links on hover so the ES/EN swap feels instant.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-BO', en: 'en-US' } } })],

  vite: {
    plugins: [tailwindcss()],
  },
});
