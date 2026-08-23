import { isDevelopment } from 'std-env'
import { z } from 'zod'
import { logger } from '#server/utils/logger'
import type { MovieOrTvResult, SearchMultiResponse } from '#shared/models/Multi'

const multiSearchSchema = z.object({
  query: z.string(),
  language: z.string().optional(),
})

export default defineCachedEventHandler(async (event) => {
  const validSearchParams = await getValidatedQuery(event, multiSearchSchema.safeParse)

  if (!validSearchParams.success) {
    const errors = validSearchParams.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
    logger.warn({ errors }, 'Invalid movie search query')
    setResponseStatus(event, 400, 'Bad Request')
    return { error: true, statusCode: 400, statusMessage: 'Bad Request', errors }
  }

  const { tmdbApi } = useRuntimeConfig(event)

  logger.info({ query: validSearchParams.data }, 'Fetching multi from TMDB')

  const response = await $fetch<SearchMultiResponse>(`${tmdbApi.baseUrl + tmdbApi.version}/search/multi`, {
    method: 'GET',
    query: { ...validSearchParams.data, page: 1, include_adult: true },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })

  // TMDB's /search/multi mixes movies, TV shows and people in one paginated list. This app has
  // no use for people, so they're dropped here; total_results is recomputed off the filtered
  // list so it matches what's actually returned instead of TMDB's unfiltered count.
  // We deliberately don't expose TMDB's pagination (page/total_pages): the frontend only shows
  // a single page of autocomplete suggestions, so it isn't used and would be misleading against
  // the filtered results anyway.
  const results = response.results.filter((result): result is MovieOrTvResult => result.media_type === 'movie' || result.media_type === 'tv')

  return {
    results,
    total_results: results.length,
  }
}, { maxAge: isDevelopment ? 1 : 60 * 60 * 24 })
