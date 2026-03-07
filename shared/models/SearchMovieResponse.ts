import type { Movie } from '#shared/models/Movie'

export interface SearchMovieResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}
