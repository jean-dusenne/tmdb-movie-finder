// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
    },
  },
  css: ['~/assets/scss/index.scss'],
  runtimeConfig: {
    tmdbApi: {
      token: '',
      baseUrl: '',
      version: '',
    },
  },
  compatibilityDate: '2025-07-15',
  elementPlus: { importStyle: 'scss', defaultLocale: 'fr' },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
  },
  // PWA module configuration: ensure manifest is found and SW auto-updates
  pwa: {
    manifest: {
      name: 'TMDB Movie Finder',
      short_name: 'MovieFinder',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#1f2937',
      description: 'Find movies using TMDB',
      icons: [
        { src: '/icons/icon-48.svg', sizes: '48x48', type: 'image/svg+xml' },
        { src: '/icons/icon-96.svg', sizes: '96x96', type: 'image/svg+xml' },
        { src: '/icons/icon-128.svg', sizes: '128x128', type: 'image/svg+xml' },
        { src: '/icons/icon-152.svg', sizes: '152x152', type: 'image/svg+xml' },
        { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { src: '/icons/icon-256.svg', sizes: '256x256', type: 'image/svg+xml' },
        { src: '/icons/icon-384.svg', sizes: '384x384', type: 'image/svg+xml' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    registerType: 'autoUpdate',
    includeAssets: ['manifest.webmanifest', 'icons/*.svg', 'icons/*.png'],
    // Ensure the service worker precaches the root and the manifest so Workbox won't complain
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
      navigateFallback: '/',
      runtimeCaching: [
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
          },
        },
      ],
    },
  },
})
