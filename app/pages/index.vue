<script setup lang="ts">
import MoviesSearch from '~/components/MoviesSearch.vue'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const { t } = useI18n()
useTitle(computed(() => t('application_title')))

const item = ref<MixedSearchResult | null>(null)
const setMovie = (selectedMovie: MixedSearchResult) => {
  item.value = selectedMovie
}
</script>

<template>
  <el-container>
    <MoviesSearch @movie-selected="setMovie" />
    <MovieDetails
      v-if="item"
      :item
    />
  </el-container>
</template>
