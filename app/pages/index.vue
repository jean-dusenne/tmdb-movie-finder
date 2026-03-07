<script setup lang="ts">
import MoviesSearch from '~/components/MoviesSearch.vue'
import type { Movie } from '#shared/models/Movie'

useTitle('TMDB movie finder')
const movie = ref<Movie | null>(null)
const setMovie = (selectedMovie: Movie) => {
  movie.value = selectedMovie
}
</script>

<template>
  <el-container>
    <MoviesSearch @movie-selected="setMovie" />
    <MovieDetails
      v-if="movie"
      :movie
    />
  </el-container>
</template>
