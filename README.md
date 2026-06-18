# interactive-seating-map-user-api

Full-stack take-home assignment for an interactive event seating map.

## Workspace

- `apps/web`: Vite, React, and TypeScript frontend shell.
- `apps/api`: Express and TypeScript backend API with users, cache, rate limiting, and async mock data fetches.
- `packages/shared`: Shared TypeScript domain types.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm safe-push
```

Run this once after cloning to enable versioned Git hooks:

```sh
pnpm setup:githooks
```

The web app serves the starter venue fixture from `apps/web/public/venue.json`.

## Backend API

Start the API:

```sh
pnpm --filter @interactive-seating-map/api dev
```

The API listens on `PORT` or `3000` by default.

### Endpoints

```sh
curl http://localhost:3000/health
```

```sh
curl http://localhost:3000/users/1
```

```sh
curl http://localhost:3000/users/999
```

```sh
curl http://localhost:3000/cache-status
```

```sh
curl -X DELETE http://localhost:3000/cache
```

```sh
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'
```

### Backend Assumptions

- Rate limiting is per IP: 10 requests per minute with a burst capacity of 5 requests in 10 seconds.
- The in-memory LRU cache is suitable for this take-home; Redis or another shared cache would be used for multi-instance production.
- A simple in-process queue is used for mock database fetches to avoid external infrastructure.
- Cache entries expire after 60 seconds and stale entries are cleared by a background task.
