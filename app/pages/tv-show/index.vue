<script lang="ts" setup>
import type { TVSeriesDetails } from '#shared/models/TvShowDetails'

definePageMeta({
  name: 'tv-show-details',
  i18n: {
    paths: {
      'en-US': '/tv-show/[id]/[title]',
      'fr-FR': '/serie/[id]/[title]',
    },
  },
})

const { params } = useRoute()
// event is only defined during SSR (direct hit/crawler) — undefined on client-side navigation.
const event = useRequestEvent()

const { data, error } = await useApi<TVSeriesDetails>(`/api/tv-shows/${params.id}`, {
  immediate: true,
  onResponseError({ response }) {
    // Sets the real HTTP status code (404, 500...) on the SSR response, e.g. for SEO/crawlers.
    // No-op on client navigation (no response left to set a status on) — MediaDetailsError below
    // covers that case visually instead.
    if (event) setResponseStatus(event, response.status)
  },
})
</script>

<template>
  <TvShowDetails
    v-if="data"
    :item="data"
  />
  <MediaDetailsError
    v-else-if="error"
    :status-code="error.status"
  />
</template>
