<script setup lang="ts">
import type { MovieDetails } from '#shared/models/MovieDetails'

const { item } = defineProps<{ item: MovieDetails }>()
</script>

<template>
  <MediaDetails
    :id="item.id"
    :title="item.title"
    :original-title="item.original_title"
    :overview="item.overview"
    :poster-path="item.poster_path"
    :original-language="item.original_language"
    :vote-average="item.vote_average"
    :adult="item.adult"
  />
</template>
