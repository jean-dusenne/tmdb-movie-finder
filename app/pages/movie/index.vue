<script lang="ts" setup>
import type { MovieDetails } from '#shared/models/MovieDetails'

definePageMeta({
  name: 'movie-details',
  i18n: {
    paths: {
      'en-US': '/movie/[:id]/[:title]',
      'fr-FR': '/film/[:id]/[:title]',
    },
  },
})

const { params } = useRoute()

const { data } = await useApi<MovieDetails>(`/api/movies/${params.id}`, {
  immediate: true,
})
</script>

<template>
  <MovieDetails
    v-if="data"
    :item="data"
  />
</template>
