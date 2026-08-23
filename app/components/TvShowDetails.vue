<script lang="ts" setup>
import type { TVSeriesDetails } from '#shared/models/TvShowDetails'

const { item } = defineProps<{ item: TVSeriesDetails }>()
</script>

<template>
  <MediaDetails
    :id="item.id"
    media-type="tv"
    :title="item.name"
    :original-title="item.original_name"
    :overview="item.overview"
    :poster-path="item.poster_path"
    :original-language="item.original_language"
    :vote-average="item.vote_average"
    :adult="item.adult"
  />
</template>
