import { posts } from './app/data/posts.js';

export default defineNuxtConfig({
  compatibilityDate: '2026-10-19',
  devtools: { enabled: false },
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Notium',
      titleTemplate: '%s · Notium',
      meta: [{ name: 'description', content: 'Materias, notas y recursos para tu semestre.' }],
    },
  },
  routeRules: {
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/subjects': { ssr: true, prerender: false, cache: false },
    '/subjects/**': { ssr: true, prerender: false, cache: false },
    '/tools': { ssr: false, prerender: false },
    '/tools/**': { ssr: false, prerender: false },
  },
  nitro: {
    preset: 'node-server',
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: ['/blog', ...posts.map((post) => `/blog/${post.slug}`)],
    },
  },
});
