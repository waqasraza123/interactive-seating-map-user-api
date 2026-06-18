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

## Frontend Seating Map

The frontend loads `apps/web/public/venue.json`, normalizes sections and seats once, and renders the seating map as SVG.

Frontend behavior:

- Renders every fixture seat at its `x` and `y` coordinates.
- Supports click, tab focus, Enter, and Space for seat interaction.
- Shows focused or clicked seat details: section, row, seat number, price, and status.
- Allows selecting up to 8 available seats.
- Keeps held, reserved, and sold seats visible but disabled.
- Shows selected seats and subtotal live.
- Persists selected seat IDs in `localStorage` and validates restored IDs against the current venue fixture.

Price tiers are assignment assumptions:

```ts
standard: 55
premium: 85
vip: 125
```

The map uses SVG because the assignment is coordinate-driven and SVG gives accessible, keyboard-focusable seat elements without a canvas accessibility layer.

### Frontend Performance QA

The default app uses the small assignment fixture:

```sh
pnpm dev
```

Generate a local 15,000-seat venue fixture:

```sh
pnpm fixture:large
```

Then open:

```text
http://localhost:5173/?venue=large
```

Manual QA for the large fixture:

- Confirm the page reports `15,000 seats loaded`.
- Select available seats and confirm the summary stays responsive.
- Use Tab once to enter the seat map, then Arrow keys to move between seats.
- Use Enter or Space to select available seats.
- Confirm held, reserved, and sold seats do not toggle selection.
- Resize to a mobile viewport and confirm the map scrolls horizontally while details and summary remain readable.

SVG is kept for this take-home because it preserves direct semantic seat elements, focus behavior, and ARIA attributes. Canvas would become preferable for larger production arenas or heavy zoom/pan interactions, but it would require a separate accessibility layer and hit-testing model.

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
