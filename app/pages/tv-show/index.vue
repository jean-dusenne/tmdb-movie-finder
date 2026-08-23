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

const { data } = await useApi<TVSeriesDetails>(`/api/tv-shows/${params.id}`, {
  immediate: true,
})
</script>

<template>
  <TvShowDetails
    v-if="data"
    :item="data"
  />
</template>
