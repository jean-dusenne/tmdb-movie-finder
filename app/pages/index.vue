<script setup lang="ts">
import MoviesSearch from '~/components/MoviesSearch.vue'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const { t } = useI18n()
useTitle(computed(() => t('application_title')))
const router = useRouter()
const localePath = useLocalePath()

const item = ref<MixedSearchResult | null>(null)
const setMovie = async (selectedMovie: MixedSearchResult) => {
  const isMovie = selectedMovie.media_type === 'movie'

  await router.push(localePath({
    name: isMovie ? 'movie-details' : 'tv-show-details',
    params: {
      id: selectedMovie.id,
      title: slugify(selectedMovie.title ?? selectedMovie.name ?? ''),
    },
  }))
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
