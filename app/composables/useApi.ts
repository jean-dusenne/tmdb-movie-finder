export const useApi = createUseFetch({
  onRequest({ options }) {
    const language = useI18n().locale.value ?? 'en-US'
    options.headers.set('tmdb-language', language)
  },
})
