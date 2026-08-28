# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Nuxt 4 app that searches TMDB (The Movie Database) for movies/TV shows via an autocomplete UI, then navigates to a dedicated detail page for the selected result. The frontend never calls TMDB directly — it goes through Nuxt server routes that inject the TMDB bearer token server-side.

## Commands

```bash
npm run dev              # dev server on http://localhost:8989
npm run build             # production build
npm run generate          # static generation
npm run preview           # preview a production build

npm test                  # run all vitest projects
npm run test:watch
npm run test:coverage
npm run test:unit         # only test/unit/*.test.ts (node env)
npm run test:nuxt         # only test/nuxt/*.test.ts (nuxt/happy-dom env)

npx vitest run test/unit/example.test.ts   # run a single test file
npx vitest run -t "test name"              # run tests matching a name

npm run lint               # eslint . (also runs via lint-staged on commit)
npx eslint . --fix

npm run test:cucumber:install   # one-time: install Playwright's Chromium
npm run test:cucumber           # boots a dev server on :8990, then runs the Cucumber/Playwright e2e suite against it
npm run test:cucumber:run       # run the e2e suite only (assumes the :8990 server is already up, e.g. via `npm run dev:cucumber`)
```

Docker (see README.md for full details): `docker build -t tmdb-movie-finder:local .` then `docker run --env-file .env -d -p 8989:8989 tmdb-movie-finder:local`. Deployed to a NAS via Dockhand, which pulls `docker-compose.yml` from `main` directly — no manual `git pull`/`docker compose` on the server.

## Environment

Configured via `runtimeConfig.tmdbApi` in `nuxt.config.ts`, populated from env vars (see `.env.example`):
- `NUXT_TMDB_API_BASE_URL` — e.g. `https://api.themoviedb.org/`
- `NUXT_TMDB_API_TOKEN` — TMDB bearer token (secret, server-only)
- `NUXT_TMDB_API_VERSION` — e.g. `3`

## Architecture

**Directory layout is Nuxt 4's `app/`-based structure** (not the old Nuxt 3 root layout): pages/components/layouts live under `app/`, not the project root.

- `app/` — Vue frontend (`app.vue`, `pages/`, `layouts/`, `components/`, `composables/`, `utils/`, `assets/scss/`, `plugins/`)
- `server/api/` — Nuxt server (Nitro) routes; file-based routing, `index.get.ts` = GET handler, `[id].get.ts` = dynamic param handler
- `server/utils/logger.ts` — shared pino logger (pretty-printed outside production, level from `LOG_LEVEL`)
- `server/middleware/logger.ts` — logs every `/api/*` request (except `/api/health`) with method/url/status/duration on response finish
- `shared/models/` — TypeScript interfaces shared between client and server (Nuxt 4 `shared/` alias, imported as `#shared/models/...`), e.g. `MixedSearchResult`, `SearchMovieResponse`, `SearchQueryParams`, `MovieDetails`, `TvShowDetails` (exports `TVSeriesDetails`), and `common.ts` for cross-model shapes (`Genre`, `ProductionCompany`, `ProductionCountry`, `SpokenLanguage`)

**Search flow**: `MoviesSearch.vue` drives an Element Plus `el-autocomplete`. User input is debounced (`useDebounceFn`, 300ms) before triggering `useFetch('/api/multi', ...)` with `immediate: false, watch: false` — the fetch is only (re)triggered manually via `refresh()` inside the debounced callback, not reactively. Selecting a suggestion emits `movieSelected` with the raw `MixedSearchResult`.

**`server/api/multi/index.get.ts`**: validates query params with a Zod schema (`getValidatedQuery` + `safeParse`), returns a structured 400 with per-field errors on failure, and otherwise proxies to TMDB's `/search/multi` endpoint with the server-side bearer token. Wrapped in `defineCachedEventHandler` (2h TTL) — Nitro's built-in response cache, so identical query params return a cached response.

**Detail page flow**: `pages/index.vue`'s `setMovie` handler (bound to `MoviesSearch`'s `movieSelected` event) slugifies the title (`app/utils/slugify.ts` — NFD-normalizes, strips diacritics, lowercases, collapses non-alphanumerics into hyphens; falls back to the numeric id for titles with no latin/alphanumeric characters, since a slug that reduces to `''` is rejected by vue-router as a missing required param) and `router.push`es to a **named route** (`movie-details` or `tv-show-details`) via `useLocalePath()`, passing `id`/`title` as route params.
- Both detail routes are declared as `pages/movie/index.vue` and `pages/tv-show/index.vue`, but their actual URLs come from `@nuxtjs/i18n`'s per-locale custom `paths` in `definePageMeta` (e.g. `/movie/[id]/[title]` in `en-US`, `/film/[id]/[title]` in `fr-FR`) — the file location does not reflect the URL shape, the `i18n.paths` config does.
- Each detail page awaits `useApi<T>('/api/{movies,tv-shows}/${id}')` (`immediate: true`) and, on a response error, forwards TMDB's status code to the page response via `setResponseStatus(useRequestEvent(), response.status)` for correct SSR status codes (e.g. 404).
- `app/composables/useApi.ts` wraps Nuxt's `createUseFetch` to inject a `tmdb-language` header from the current `useI18n().locale` on every request — the server endpoints read this header (`getHeader(event, 'tmdb-language')`) and forward it to TMDB as the `language` query param, and `defineCachedEventHandler`'s `varies: ['tmdb-language']` keys the cache by it.
- Rendering: `MovieDetails.vue` and `TvShowDetails.vue` are thin adapters that map their respective model's field names (`title`/`original_title` vs `name`/`original_name`) onto the shared presentational `MediaDetails.vue` component. `MediaDetailsError.vue` renders a 404-vs-generic-error `el-result` with a link back home, shown when the detail fetch fails.

**Path aliases**: `#server/...` and `#shared/...` are Nuxt 4 auto-generated aliases (see usage in `server/api/multi/index.get.ts` and `shared/models/*`) — use these rather than relative paths when importing across `server/`/`shared/`.

**i18n**: `@nuxtjs/i18n`, configured in `nuxt.config.ts` with locale codes `en-US`/`fr-FR` (files `i18n/locales/{en,fr}.json`); `fr-FR` is the default locale (also the Element Plus `defaultLocale: 'fr'`). Components pull strings via `useI18n()`'s `t()` (see `app/layouts/default.vue`). Per-page custom URL paths are set via `definePageMeta({ i18n: { paths: {...} } })`, as in the detail pages above.

**PWA**: `@vite-pwa/nuxt`, configured in `nuxt.config.ts` (`pwa` key) — manifest/icons under `public/icons/` + `public/manifest.webmanifest`, `registerType: 'autoUpdate'`, and a Workbox `NetworkFirst` runtime-caching rule for `/api/.*`.

**Layout**: `app/layouts/default.vue` wraps pages in an Element Plus `el-container` (header/main/footer). On mobile the footer is `position: fixed` (see `index.scss`); `app/plugins/sticky-footer.client.ts` mirrors the footer's live height into a `--footer-height` CSS custom property (via `ResizeObserver`) so `.app-main` can pad around it.

**End-to-end tests**: `features/` holds a Cucumber.js + Playwright suite (config in `features/cucumber.json`, run via `npm run test:cucumber`, which uses `start-server-and-test` to boot a dev server on port 8990 before running). `features/support/world.ts` defines the `TestWorld` (a Playwright `Browser`/`Page` pair, `baseUrl: http://localhost:8990`); `features/support/hooks.ts`'s `Before` hook launches headless Chromium and stubs `/api/multi` and `/api/movies/:id` via Playwright route interception (no real TMDB calls) before each scenario. Step definitions live in `features/step_definitions/steps.ts`; scenarios in `features/*.feature`.

## Conventions

- **Commits**: Conventional Commits, enforced by commitlint (`@commitlint/config-conventional`) via a husky `commit-msg` hook. `pre-commit` runs `lint-staged` (`eslint --fix` on staged `.js/.ts/.vue/.mjs/.cjs`); `pre-push` runs `npm test` (the vitest suite).
- **CI**: `.github/workflows/lint-test.yml` runs on every PR (skipped for `release-please--branches--*` head branches) — `npm run lint`, then `npm test`, then the Cucumber/Playwright e2e suite (`test:cucumber:install` + `test:cucumber`).
- **Releases**: `release-please` (GitHub Action on push to `main`) drives versioning/changelog from Conventional Commit history — don't hand-edit `CHANGELOG.md` or bump `version` in `package.json` manually.
- **Dependency updates**: Renovate (`renovate.json`) groups devDependency minor/patch bumps into a single weekly (Saturday) auto-merged PR; other updates (majors, prod deps) are opened individually for manual review.
- **Styling**: UnoCSS (`uno.config.ts`, Wind4 preset + attributify/icons/typography/web fonts) alongside Element Plus (SCSS import style) and scoped component `<style>` blocks. `app/assets/scss/index.scss` / `dark.scss` are the global stylesheets.
- **ESLint**: `@nuxt/eslint` flat config with stylistic rules enabled — formatting issues (spacing, quotes, etc.) are lint errors, not just style nits.
