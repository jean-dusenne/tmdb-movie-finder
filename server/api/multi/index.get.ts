import { z } from 'zod'
import { logger } from '#server/utils/logger'

const multiSearchSchema = z.object({
  query: z.string(),
  page: z.string().transform(val => parseInt(val, 10)),
  include_adult: z.string().optional().transform(val => val === 'true'),
  language: z.string().optional(),
  primary_release_year: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  const validSearchParams = await getValidatedQuery(event, multiSearchSchema.safeParse)

  if (!validSearchParams.success) {
    const errors = validSearchParams.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
    logger.warn({ errors }, 'Invalid movie search query')
    setResponseStatus(event, 400, 'Bad Request')
    return { error: true, statusCode: 400, statusMessage: 'Bad Request', errors }
  }

  const { tmdbApi } = useRuntimeConfig(event)

  logger.info({ query: validSearchParams.data }, 'Fetching multi from TMDB')

  return await $fetch(`${tmdbApi.baseUrl + tmdbApi.version}/search/multi`, {
    method: 'GET', query: getQuery(event), headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })
})
