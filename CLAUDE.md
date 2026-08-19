# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Nuxt 4 app that searches TMDB (The Movie Database) for movies/TV shows via an autocomplete UI and displays details for the selected result. The frontend never calls TMDB directly — it goes through a Nuxt server route that injects the TMDB bearer token server-side.

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

npx eslint .               # lint (also runs via lint-staged on commit)
npx eslint . --fix
```

Docker (see README.md for full details): `docker build -t tmdb-movie-finder:local .` then `docker run --env-file .env -d -p 8989:8989 tmdb-movie-finder:local`. Deployed to a NAS via Dockhand, which pulls `docker-compose.yml` from `main` directly — no manual `git pull`/`docker compose` on the server.

## Environment

Configured via `runtimeConfig.tmdbApi` in `nuxt.config.ts`, populated from env vars (see `.env.example`):
- `NUXT_TMDB_API_BASE_URL` — e.g. `https://api.themoviedb.org/`
- `NUXT_TMDB_API_TOKEN` — TMDB bearer token (secret, server-only)
- `NUXT_TMDB_API_VERSION` — e.g. `3`

## Architecture

**Directory layout is Nuxt 4's `app/`-based structure** (not the old Nuxt 3 root layout): pages/components/layouts live under `app/`, not the project root.

- `app/` — Vue frontend (`app.vue`, `pages/`, `layouts/`, `components/`, `assets/scss/`, `plugins/`)
- `server/api/` — Nuxt server (Nitro) routes; file-based routing, `index.get.ts` = GET handler
- `server/utils/logger.ts` — shared pino logger (pretty-printed outside production, level from `LOG_LEVEL`)
- `server/middleware/logger.ts` — logs every `/api/*` request (except `/api/health`) with method/url/status/duration on response finish
- `shared/models/` — TypeScript interfaces shared between client and server (Nuxt 4 `shared/` alias, imported as `#shared/models/...`), e.g. `MixedSearchResult`, `SearchMovieResponse`, `SearchQueryParams`
- `test/unit/` — plain node-env vitest tests; `test/nuxt/` — vitest tests that boot the Nuxt runtime (`environment: 'nuxt'`, happy-dom), using `mountSuspended` from `@nuxt/test-utils/runtime` for component mounts. These are separate Vitest *projects* defined in `vitest.config.ts`, each with its own `include` glob — put new tests in the matching directory or add a new project.

**Search flow**: `MoviesSearch.vue` drives an Element Plus `el-autocomplete`. User input is debounced (`useDebounceFn`, 300ms) before triggering `useFetch('/api/multi', ...)` with `immediate: false, watch: false` — the fetch is only (re)triggered manually via `refresh()` inside the debounced callback, not reactively. Selecting a suggestion emits `movieSelected`, which `pages/index.vue` uses to set the item passed to `MovieDetails.vue`.

**`server/api/multi/index.get.ts`**: validates query params with a Zod schema (`getValidatedQuery` + `safeParse`), returns a structured 400 with per-field errors on failure, and otherwise proxies to TMDB's `/search/multi` endpoint with the server-side bearer token. Wrapped in `defineCachedEventHandler` (2h TTL) — Nitro's built-in response cache, so identical query params return a cached response.

**Path aliases**: `#server/...` and `#shared/...` are Nuxt 4 auto-generated aliases (see usage in `server/api/multi/index.get.ts` and `shared/models/*`) — use these rather than relative paths when importing across `server/`/`shared/`.

**i18n**: `@nuxtjs/i18n`, configured in `nuxt.config.ts` with `en`/`fr` locales backed by `i18n/locales/{en,fr}.json`; `fr` is the default locale (also the Element Plus `defaultLocale`). Components pull strings via `useI18n()`'s `t()` (see `app/layouts/default.vue`).

**PWA**: `@vite-pwa/nuxt`, configured in `nuxt.config.ts` (`pwa` key) — manifest/icons under `public/icons/` + `public/manifest.webmanifest`, `registerType: 'autoUpdate'`, and a Workbox `NetworkFirst` runtime-caching rule for `/api/.*`.

**Layout**: `app/layouts/default.vue` wraps pages in an Element Plus `el-container` (header/main/footer). On mobile the footer is `position: fixed` (see `index.scss`); `app/plugins/sticky-footer.client.ts` mirrors the footer's live height into a `--footer-height` CSS custom property (via `ResizeObserver`) so `.app-main` can pad around it.

## Conventions

- **Commits**: Conventional Commits, enforced by commitlint (`@commitlint/config-conventional`) via a husky `commit-msg` hook. `pre-commit` runs `lint-staged` (`eslint --fix` on staged `.js/.ts/.vue/.mjs/.cjs`).
- **Releases**: `release-please` (GitHub Action on push to `main`) drives versioning/changelog from Conventional Commit history — don't hand-edit `CHANGELOG.md` or bump `version` in `package.json` manually.
- **Styling**: UnoCSS (`uno.config.ts`, Wind4 preset + attributify/icons/typography/web fonts) alongside Element Plus (SCSS import style) and scoped component `<style>` blocks. `app/assets/scss/index.scss` / `dark.scss` are the global stylesheets.
- **ESLint**: `@nuxt/eslint` flat config with stylistic rules enabled — formatting issues (spacing, quotes, etc.) are lint errors, not just style nits.
