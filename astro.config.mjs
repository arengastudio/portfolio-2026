import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://juancruzluna.com',
  integrations: [react(), mdx(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  redirects: {
    '/lab':            '/',
    '/en/lab':         '/en',
    '/work/arenga':    'https://arengastudio.com',
    '/en/work/arenga': 'https://arengastudio.com',
  },
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } })
});
