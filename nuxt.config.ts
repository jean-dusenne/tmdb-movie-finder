// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/test-utils',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  css: [
    '~/assets/scss/index.scss',
  ],
  runtimeConfig: {
    tmdbApi: {
      token: '',
      baseUrl: '',
      version: '',
    },
  },
  compatibilityDate: '2025-07-15',
  elementPlus: { importStyle: 'scss', defaultLocale: 'en' },

})
