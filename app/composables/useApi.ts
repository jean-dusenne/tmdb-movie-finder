export const useApi = createUseFetch({
  onRequest({ options }) {
    const language = useI18n().locale.value ?? 'fr-FR'
    const headers = new Headers(options.headers)
    headers.set('tmdb-language', language)
    options.headers = headers
  },
})
