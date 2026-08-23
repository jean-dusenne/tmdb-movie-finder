import type { Genre, ProductionCompany, ProductionCountry, SpokenLanguage } from '#shared/models/common'

export interface MovieDetails {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: MovieCollection | null
  budget: number
  genres: Genre[]
  homepage: string | null
  id: number
  imdb_id: string | null
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string // format: YYYY-MM-DD
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: MovieStatus
  tagline: string | null
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

interface MovieCollection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

type MovieStatus
  = | 'Rumored'
    | 'Planned'
    | 'In Production'
    | 'Post Production'
    | 'Released'
    | 'Canceled'
