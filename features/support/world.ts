import type { Browser, Page } from 'playwright'
import { setWorldConstructor, World } from '@cucumber/cucumber'

export class TestWorld extends World {
  browser!: Browser
  page!: Page
  baseUrl = 'http://localhost:8990'
}

setWorldConstructor(TestWorld)
