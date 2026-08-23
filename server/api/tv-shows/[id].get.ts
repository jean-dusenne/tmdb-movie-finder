import { isDevelopment } from 'std-env'
import { z } from 'zod'
import type { TVSeriesDetails } from '#shared/models/TvShowDetails'

const tvShowIdSchema = z.string().regex(/^\d+$/, 'id must be numeric')

export default defineCachedEventHandler(async (event) => {
  const validId = tvShowIdSchema.safeParse(getRouterParam(event, 'id'))

  if (!validId.success) {
    const errors = validId.error.issues.map(i => ({ field: 'id', message: i.message }))
    logger.warn({ errors }, 'Invalid TV show id')
    setResponseStatus(event, 400, 'Bad Request')
    return { error: true, statusCode: 400, statusMessage: 'Bad Request', errors }
  }

  const id = validId.data
  const { tmdbApi } = useRuntimeConfig(event)
  const query = { ...getQuery(event), language: getHeader(event, 'tmdb-language') }

  logger.info({ id, query }, 'Fetching TV show from TMDB')

  return await $fetch<TVSeriesDetails>(`${tmdbApi.baseUrl + tmdbApi.version}/tv/${id}`, {
    method: 'GET', query, headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })
}, {
  maxAge: isDevelopment ? 1 : 60 * 60 * 24,
  varies: ['tmdb-language'],
})
