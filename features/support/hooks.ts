import { After, Before, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium } from 'playwright'
import type { TestWorld } from './world'

setDefaultTimeout(30_000)

const movie = {
  id: 123,
  title: 'Inception',
  original_title: 'Inception',
  overview: 'A dream within a dream.',
  poster_path: null,
  backdrop_path: null,
  media_type: 'movie',
  adult: false,
  original_language: 'en',
  popularity: 100,
  vote_average: 8.4,
  vote_count: 1000,
  genre_ids: [],
  video: false,
  release_date: '2010-07-16',
}

Before(async function (this: TestWorld) {
  this.browser = await chromium.launch({ headless: true })
  const context = await this.browser.newContext()

  await context.route('**/api/multi**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ page: 1, results: [movie], total_pages: 1, total_results: 1 }),
    })
  })

  await context.route('**/api/movies/123**', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(movie) })
  })

  this.page = await context.newPage()
})

After(async function (this: TestWorld) {
  await this.browser?.close()
})
