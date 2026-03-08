import { z } from 'zod'
import { logger } from '#server/utils/logger'

const moviesSearchSchema = z.object({
  query: z.string(),
  page: z.string().transform(val => parseInt(val, 10)),
  include_adult: z.string().optional().transform(val => val === 'true'),
  region: z.string().optional(),
  year: z.number().optional(),
  primary_release_year: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  const validSearchParams = await getValidatedQuery(event, moviesSearchSchema.safeParse)

  if (!validSearchParams.success) {
    const errors = validSearchParams.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
    logger.warn({ errors }, 'Invalid movie search query')
    setResponseStatus(event, 400, 'Bad Request')
    return { error: true, statusCode: 400, statusMessage: 'Bad Request', errors }
  }

  const { tmdbApi } = useRuntimeConfig(event)

  logger.info({ query: validSearchParams.data }, 'Fetching movies from TMDB')

  return await $fetch(`${tmdbApi.baseUrl + tmdbApi.version}/search/movie`, {
    method: 'GET', query: getQuery(event), headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })
})
