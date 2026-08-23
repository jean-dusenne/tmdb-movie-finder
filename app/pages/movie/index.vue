<script lang="ts" setup>
import type { MovieDetails } from '#shared/models/MovieDetails'

definePageMeta({
  name: 'movie-details',
  i18n: {
    paths: {
      'en-US': '/movie/[id]/[title]',
      'fr-FR': '/film/[id]/[title]',
    },
  },
})

const { params } = useRoute()
const event = useRequestEvent()

const { data, error } = await useApi<MovieDetails>(`/api/movies/${params.id}`, {
  immediate: true,
  onResponseError({ response }) {
    if (event) setResponseStatus(event, response.status)
  },
})
</script>

<template>
  <MovieDetails
    v-if="data"
    :item="data"
  />
  <MediaDetailsError
    v-else-if="error"
    :status-code="error.status"
  />
</template>
