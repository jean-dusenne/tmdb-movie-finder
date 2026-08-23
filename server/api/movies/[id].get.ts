import type { MovieDetails } from '#shared/models/MovieDetails'
import { isDevelopment } from 'std-env'
import { z } from 'zod'

const movieIdSchema = z.string().regex(/^\d+$/, 'id must be numeric')

export default defineCachedEventHandler(async (event) => {
  const validId = movieIdSchema.safeParse(getRouterParam(event, 'id'))

  if (!validId.success) {
    const errors = validId.error.issues.map(i => ({ field: 'id', message: i.message }))
    logger.warn({ errors }, 'Invalid movie id')
    setResponseStatus(event, 400, 'Bad Request')
    return { error: true, statusCode: 400, statusMessage: 'Bad Request', errors }
  }

  const id = validId.data
  const { tmdbApi } = useRuntimeConfig(event)
  const query = { ...getQuery(event), language: getHeader(event, 'tmdb-language') }

  logger.info({ id, query }, 'Fetching movie from TMDB')

  return await $fetch<MovieDetails>(`${tmdbApi.baseUrl + tmdbApi.version}/movie/${id}`, {
    method: 'GET', query,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })
}, {
  maxAge: isDevelopment ? 1 : 60 * 60 * 24,
  varies: ['tmdb-language'],
})
