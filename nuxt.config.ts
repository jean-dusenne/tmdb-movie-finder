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
  ],
  devtools: { enabled: true },
  css: [
    '~/assets/scss/index.scss',
  ],
  compatibilityDate: '2025-07-15',
  elementPlus: { importStyle: 'scss', defaultLocale: 'en' },
})
