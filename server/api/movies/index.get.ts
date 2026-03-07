import { z } from 'zod'

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

  if (!validSearchParams.success)
    throw validSearchParams.error

  const { tmdbApi } = useRuntimeConfig(event)

  const movies = await $fetch(`${tmdbApi.baseUrl + tmdbApi.version}/search/movie`, {
    method: 'GET', query: getQuery(event), headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbApi.token}`,
    },
  })

  return movies
})
