# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:8989`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

Build the production image (default: distroless Node 24 image `gcr.io/distroless/nodejs24-debian13`):

```bash
# Build (distroless by default)
docker build -t tmdb-movie-finder:distroless .
```

Run the container (exposes port 8989):

```bash
docker run -d -p 8989:8989 --name tmdb-movie-finder tmdb-movie-finder:distroless
```

Override the runtime image (useful for local testing with `node:24-slim`):

```bash
# Build using a different runtime image (example: node:24-slim)
docker build --build-arg RUNTIME_IMAGE=node:24-slim -t tmdb-movie-finder:local .
# Run the locally-built image
docker run -d -p 8989:8989 --name tmdb-movie-finder-local tmdb-movie-finder:local
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
docker build -t tmdb-movie-finder:distroless .

# Run and load variables from .env
docker run --env-file .env -d -p 8989:8989 --name tmdb-movie-finder tmdb-movie-finder:distroless
```

docker-compose example (convenient for local development):

```yaml
version: "3.8"
services:
  app:
    image: tmdb-movie-finder:distroless
    build:
      context: .
      args:
        # optionally override runtime image for local testing
        RUNTIME_IMAGE: node:24-slim
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
docker rmi tmdb-movie-finder:distroless || true
```

Notes:
- Docker must be installed and running locally to use these commands.
- The Dockerfile uses a multi-stage build: the app is built with `node:24` and run on the minimal runtime defined by the `RUNTIME_IMAGE` build-arg (default: `gcr.io/distroless/nodejs24-debian13`).
- To force a different runtime (for CI or local debugging), use `--build-arg RUNTIME_IMAGE=...` when building.

## Deployment on a NAS

Here are practical steps to deploy this application on a NAS using `docker compose`.

Prerequisites
- Docker installed on the NAS.
- SSH access or web interface of the NAS to copy project files.
- A `.env` file present on the NAS (do not commit secrets to the repository).

Important: GitHub Personal Access Token (if your repo is private)

If the repository is private you will need a GitHub Personal Access Token (PAT) to clone it from the NAS. Create or regenerate a token in GitHub and use it in the clone URL or during authentication.

Go to GitHub → Settings → Developer settings → Personal access tokens and either regenerate or create a new token.

If using a Fine-grained PAT:
- Repository access: select the specific repository `jean-dusenne/tmdb-movie-finder`.
- Permissions: set `Contents` → `Read-only`.

If using a Classic (legacy) PAT:
- Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) and create a new token.
- Scopes: check `repo` (Full control of private repositories). This scope allows cloning private repos over HTTPS. Note: the `repo` scope grants broad access (read/write) to repository contents — prefer a Fine-grained PAT when possible.

Keep the token secret and do not add it to the repository. You can use it in a clone command like:

```bash
# example: include token in the clone URL (avoid keeping this command in shell history)
GITHUB_TOKEN=ghp_xxx
git clone https://$GITHUB_TOKEN@github.com/jean-dusenne/tmdb-movie-finder.git
```

Recommended steps

1) Clone the project to the NAS :

```bash
# from your local machine
ssh user@nas_url 'cd /path/to/project && git clone https://<github_token>@github.com/jean-dusenne/tmdb-movie-finder.git''
```

# Reset repository on the NAS (force to remote)

If you need to force the NAS copy to match the remote `origin/main` (warning: this will discard local changes), run the following from your local machine — replace the host/user as needed:

```bash
ssh janbomber@*********** 'cd /volume1/docker/tmdb-movie-finder && git fetch --all && git reset --hard origin/main'
```

Notes:
- This command runs `git fetch --all` and then forcibly resets the working tree to `origin/main`. Any uncommitted or local commits on the NAS will be lost.
- If you want to reset to a different branch, replace `origin/main` with `origin/your-branch`.
- Prefer creating backups or using `git stash` on the NAS before running this if you are unsure.

2) Connect to the NAS and launch the stack with `docker compose` :

```bash
ssh user@nas
cd /path/to/project
# build and start in the background
docker compose up --build -d
```

3) Runtime override (optional)

To force a different runtime image (useful for debug/local) :

```bash
# from the NAS
RUNTIME_IMAGE=node:24-slim docker compose up --build -d
```

4) Checks and management

```bash
# follow the logs
docker compose logs -f
# status of the containers
docker compose ps
# stop
docker compose down
```
