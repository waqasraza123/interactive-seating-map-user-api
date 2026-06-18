# interactive-seating-map-user-api

Full-stack take-home assignment for an interactive event seating map.

The app lets a user browse an event venue, inspect seat details, select up to 8 available seats, and see a live subtotal. The API demonstrates production-style backend patterns around user data, caching, rate limiting, and async processing without external infrastructure.

## Architecture

This is a pnpm TypeScript monorepo.

- `apps/web`: Vite, React, TypeScript, SVG seating map UI.
- `apps/api`: Express, TypeScript, user data API.
- `packages/shared`: Shared domain and API response types.
- `scripts`: repository workflow and local fixture generation scripts.

The repo keeps frontend, backend, and shared types separate so each workspace can build, typecheck, and lint independently while sharing stable contracts.

## Commands

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm typecheck
pnpm lint
pnpm safe-push
```

After cloning, enable versioned Git hooks:

```sh
pnpm setup:githooks
```

`pnpm dev` runs the web app and API together. By default:

- Web: `http://localhost:5173`
- API: `http://localhost:3000`

## Frontend

The frontend loads `apps/web/public/venue.json`, normalizes sections and seats once, and renders seats in an SVG map at their fixture coordinates.

Implemented behavior:

- Click, Enter, and Space select available seats.
- Arrow keys move roving focus across seats.
- Focus or click updates the details panel.
- Seats expose `aria-label`, `aria-pressed`, and `aria-disabled`.
- Held, reserved, and sold seats are visible but not selectable.
- Selected seats persist in `localStorage` and are validated against current venue data on reload.
- Selected seat summary updates live with subtotal.
- Responsive layout keeps the map scrollable and details readable on mobile.

Price tiers are assignment assumptions because the prompt gives tiers but no exact prices:

```ts
standard: 55
premium: 85
vip: 125
```

### SVG Trade-Off

SVG is used because the assignment is coordinate-driven and each seat can remain a real focusable element with ARIA state. This keeps accessibility straightforward for the take-home.

For very large production venues with heavy zooming, panning, and animation, Canvas or WebGL would likely render faster. That would require separate hit testing and an accessibility layer, so SVG is the better default here.

### Large Venue QA

Generate a local 15,000-seat fixture:

```sh
pnpm fixture:large
```

Then run the app and open:

```text
http://localhost:5173/?venue=large
```

`apps/web/public/venue-large.json` is generated locally and ignored by git.

## Backend

The backend is an Express API with a small mock user data store.

Mock users:

- `1`: John Doe, `john@example.com`
- `2`: Jane Smith, `jane@example.com`
- `3`: Alice Johnson, `alice@example.com`

Backend behavior:

- Simulates database reads with a 200ms delay.
- Uses an in-memory LRU cache with 60s TTL.
- Tracks cache hits, misses, current size, and average response time.
- Clears stale cache entries with a background task.
- Deduplicates concurrent requests for the same user ID with single-flight handling.
- Runs mock database fetches through a simple in-process async queue.
- Rate limits per IP: 10 requests per minute and burst capacity of 5 requests per 10 seconds.
- Returns clean JSON errors for validation, missing users, unknown routes, and rate limits.

### Backend Trade-Offs

The cache, rate limiter, queue, and mock data store are process-local by design for the take-home. They are simple, inspectable, and require no external services.

For multi-instance production, Redis would be a better fit for shared cache and rate-limit state. BullMQ or another durable queue would be more appropriate for background work that must survive restarts.

## API Examples

Health:

```sh
curl http://localhost:3000/health
```

Get an existing user:

```sh
curl http://localhost:3000/users/1
```

Get a missing user:

```sh
curl http://localhost:3000/users/999
```

Create a user:

```sh
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'
```

Cache status:

```sh
curl http://localhost:3000/cache-status
```

Clear cache:

```sh
curl -X DELETE http://localhost:3000/cache
```

## Automated Tests

Run all focused backend and frontend tests:

```sh
pnpm test
```

The backend suite uses Vitest and Supertest to cover health, user lookup, missing-user JSON errors, cache hits and misses, cache clearing, user creation, rate limiting, and service-level single-flight deduplication.

The frontend suite uses Vitest, Testing Library React, and user-event to cover app rendering, venue seats, available seat selection, unavailable seat behavior, and selected-seat summary/subtotal updates.

## Manual QA Checklist

Run static checks:

```sh
pnpm test
pnpm build
pnpm typecheck
pnpm lint
```

Frontend:

- Open `http://localhost:5173`.
- Confirm venue seats render.
- Select available seats and verify details/subtotal update.
- Confirm held, reserved, and sold seats do not select.
- Select 8 seats and confirm the limit is enforced.
- Reload and confirm selected seats restore from `localStorage`.
- Use Tab to enter the map, Arrow keys to move focus, and Enter/Space to select.
- Resize to mobile width and confirm map scrolling and panels remain usable.
- Run `pnpm fixture:large`, open `/?venue=large`, and confirm `15,000 seats loaded`.

Backend:

- Start `pnpm dev`.
- Verify `GET /health`.
- Verify `GET /users/1`.
- Verify `GET /users/999` returns a 404 JSON error.
- Verify `POST /users` creates a user.
- Verify `GET /cache-status` changes after user reads.
- Verify `DELETE /cache` clears cached entries.
- Send more than 10 requests in a minute from one IP and confirm `429`.

## Incomplete / Deferred

- No CI workflow yet.
- No formatter configuration yet.
- No database, authentication, deployment target, or persistent background queue.
- Frontend does not integrate with backend user data because the seating-map assignment does not require it.
- Large venue rendering is validated with SVG, but Canvas/WebGL would be revisited for larger production-scale maps with zoom/pan requirements.
