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
const event = useRequestEvent()

const { data, error } = await useApi<TVSeriesDetails>(`/api/tv-shows/${params.id}`, {
  immediate: true,
  onResponseError({ response }) {
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
