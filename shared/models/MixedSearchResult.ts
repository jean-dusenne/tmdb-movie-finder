type media_type = 'movie' | 'tv'

export interface MixedSearchResult {
  adult: boolean
  backdrop_path: string
  id: number
  title: string
  original_language: string
  original_title: string
  overview: string
  poster_path: string
  media_type: media_type
  genre_ids: number[]
  popularity: number
  release_date: string
  video: boolean
  vote_average: number
  vote_count: number
  name: string
  original_name: string
}
