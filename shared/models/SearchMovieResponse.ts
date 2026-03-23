import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

export interface SearchMovieResponse {
  results: MixedSearchResult[]
  page: number
  total_pages: number
  total_results: number
}
