import { Given, When, Then } from '@cucumber/cucumber'
import type { TestWorld } from '../support/world'

Given('the movie finder is open', async function (this: TestWorld) {
  await this.page.goto(this.baseUrl)
  await this.page.waitForLoadState('networkidle')
  await this.page.locator('input').waitFor()
})

When('I search for {string}', async function (this: TestWorld, query: string) {
  const input = this.page.locator('input')
  await input.click()
  await input.pressSequentially(query)
})

Then('I should see {string} in the search suggestions', async function (this: TestWorld, title: string) {
  await this.page.getByText(title, { exact: true }).first().waitFor()
})

When('I select the {string} search suggestion', async function (this: TestWorld, title: string) {
  await this.page.getByText(title, { exact: true }).first().click()
})

Then('I should be on the movie details page for {string}', async function (this: TestWorld, title: string) {
  await this.page.waitForURL(/\/(movie|film)\/123\/inception$/)
  const actualTitle = await this.page.locator('h1.movie-title').textContent()
  if (actualTitle !== title) throw new Error(`Expected movie title ${title}, received ${actualTitle}`)
})
