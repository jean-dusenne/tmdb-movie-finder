# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install ci
```

## Development Server

Start the development server on `http://localhost:8989`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

Build the production image (default: use `node:24-slim` as runtime):

```bash
# Build (default runtime node:24-slim)
docker build -t tmdb-movie-finder:local .
```

Run the container (exposes port 8989):

```bash
docker run -d -p 8989:8989 --name tmdb-movie-finder tmdb-movie-finder:local
```
Passing environment variables (using a .env file)

It's recommended to keep your `.env` out of the image and provide it at runtime. Add `.env` to `.dockerignore` (already done) so secrets are not included in the build context.

Example `.env` (do not commit this file to version control):

```env
API_KEY=ma_cle_secrete
NODE_ENV=production
OTHER_SETTING=value
```

Run with `--env-file` to inject these variables at container start:

```bash
# Build (image remains generic, no secrets baked in)
docker build -t tmdb-movie-finder:local .

# Run and load variables from .env
docker run --env-file .env -d -p 8989:8989 --name tmdb-movie-finder tmdb-movie-finder:local
```

docker-compose example (convenient for local development):

```yaml
services:
  app:
    image: tmdb-movie-finder:local
    build:
      context: .
    ports:
      - "8989:8989"
    env_file:
      - .env
```

Then start with:

```bash
docker-compose up --build
```

Quick checks & cleanup:

```bash
# Follow container logs
docker logs -f tmdb-movie-finder

# Smoke test the server
curl -I http://localhost:8989

# Stop & remove container
docker rm -f tmdb-movie-finder || true

# Remove image
docker rmi tmdb-movie-finder:local || true
```

Notes:
- Docker must be installed and running locally to use these commands.
- The Dockerfile uses a multi-stage build: the app is built with `node:24` and run on `node:24-slim`.

## Deployment on a NAS (via Dockhand)

Deployment on the NAS is managed with [Dockhand](https://dockhand.pro/), a self-hosted Docker web UI. Dockhand pulls this repository's `docker-compose.yml` directly from Git and (re)deploys the stack, so there's no need to manually SSH in, `git clone`/`git reset`, or run `docker compose` by hand.

Prerequisites
- Docker installed on the NAS.
- Dockhand running on the NAS, with its UI reachable (e.g. `http://<nas-address>:3000`).
- A GitHub Personal Access Token (PAT) if the repository is private — create one under GitHub → Settings → Developer settings → Personal access tokens (Fine-grained, `Contents: Read-only`, scoped to `jean-dusenne/tmdb-movie-finder`; or Classic with the `repo` scope).

### 1. Create the stack from this repository

In Dockhand, choose **Create stack → Git-based deployment** and fill in:
- **Repository URL**: `https://github.com/jean-dusenne/tmdb-movie-finder.git` (or the SSH URL)
- **Branch**: `main`
- **Compose file path**: `docker-compose.yml`

For a private repository, add credentials once under **Settings → Git** (PAT or SSH key) — Dockhand stores them encrypted at rest (AES-256-GCM) instead of embedding the token in clone URLs or shell history.

### 2. Configure environment variables

In the stack's environment panel, set the same variables normally provided via `.env` (e.g. `API_KEY`, `NODE_ENV`); mark secrets so Dockhand stores them encrypted rather than in a plain `.env` file.

### 3. Deploy & keep in sync

Deploy the stack from the UI. Dockhand clones the repo locally and can auto-sync/redeploy whenever `main` updates, or you can trigger a redeploy manually — replacing the old `git fetch --all && git reset --hard origin/main` + `docker compose up --build -d` workflow. Logs, container status, and stop/restart controls are also available directly from the Dockhand UI.
