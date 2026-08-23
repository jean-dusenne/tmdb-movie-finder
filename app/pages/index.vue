<script setup lang="ts">
import MoviesSearch from '~/components/MoviesSearch.vue'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const { t } = useI18n()
useTitle(computed(() => t('application_title')))
const router = useRouter()
const localePath = useLocalePath()

const setMovie = async (selectedMovie: MixedSearchResult) => {
  const isMovie = selectedMovie.media_type === 'movie'
  // Titles with no latin/alphanumeric character (e.g. Japanese, Chinese, Arabic)
  // slugify to an empty string, which vue-router rejects as a missing required param.
  const titleSlug = slugify(selectedMovie.title ?? selectedMovie.name ?? '') || String(selectedMovie.id)

  await router.push(localePath({
    name: isMovie ? 'movie-details' : 'tv-show-details',
    params: {
      id: selectedMovie.id,
      title: titleSlug,
    },
  }))
}
</script>

<template>
  <el-container>
    <MoviesSearch @movie-selected="setMovie" />
  </el-container>
</template>
