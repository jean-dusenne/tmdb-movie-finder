// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    // Use the recommended Nuxt ESLint module (follow https://eslint.nuxt.com/packages/module)
    '@nuxtjs/eslint-module',
    '@nuxt/test-utils',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
})
