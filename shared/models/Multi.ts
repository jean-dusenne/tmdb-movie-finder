export interface MovieResult {
  media_type: 'movie'
  adult: boolean
  backdrop_path: string | null
  id: number
  title: string
  original_language: string
  original_title: string
  overview: string
  poster_path: string | null
  genre_ids: number[]
  popularity: number
  release_date: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TvResult {
  media_type: 'tv'
  adult: boolean
  backdrop_path: string | null
  id: number
  name: string
  original_language: string
  original_name: string
  overview: string
  poster_path: string | null
  genre_ids: number[]
  popularity: number
  first_air_date: string
  vote_average: number
  vote_count: number
  origin_country: string[]
}

interface PersonResult {
  media_type: 'person'
  adult: boolean
  id: number
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  known_for_department: string
  gender: number
  known_for: (MovieResult | TvResult)[]
}

type SearchMultiResult = MovieResult | TvResult | PersonResult

export type MovieOrTvResult = MovieResult | TvResult

export interface SearchMultiResponse {
  results: SearchMultiResult[]
  total_results: number
}
