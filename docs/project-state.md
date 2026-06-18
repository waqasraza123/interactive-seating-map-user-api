# Project State

## Product

`interactive-seating-map-user-api` is a full-stack take-home assignment for an interactive event seating map. The product includes a React frontend and an Express user data API with in-memory caching, rate limiting, and async mock data fetches.

## Current Architecture

- Repository is a pnpm TypeScript monorepo.
- Root package is private and pins `pnpm@10.13.1` through `packageManager`.
- Workspace packages live under `apps/*` and `packages/*`.
- `apps/web` is a Vite, React, and TypeScript frontend shell.
- `apps/api` is an Express and TypeScript backend with `/health`, `/users/:id`, `POST /users`, `DELETE /cache`, and `GET /cache-status`.
- API modules are organized under routes, services, middleware, cache, queue, data, errors, and validation folders.
- `packages/shared` contains shared TypeScript domain and response types for venue fixtures, users, cache status, and API responses.
- `apps/web/public/venue.json` is the starter public venue fixture.
- The repository has a versioned safe-push workflow through `.githooks/pre-push`, `scripts/verify-push.sh`, and `scripts/safe-push.sh`.
- Strict TypeScript is enabled through `tsconfig.base.json` and package-level configs.
- ESLint is configured at the root and run per workspace.

## Non-Negotiable Rules

- Use pnpm.
- Keep the TypeScript monorepo structure aligned with `apps/*` and `packages/*`.
- Keep frontend code in `apps/web`, backend code in `apps/api`, and cross-boundary types in `packages/shared`.
- Do not store secrets in repo memory or local session memory.
- Keep `docs/project-state.md` durable, concise, and focused on architecture, roadmap, constraints, and important decisions.
- Keep `docs/_local/current-session.md` local and ignored.
- No comments in code unless truly necessary.
- Use descriptive, consistent names and maintain modular, testable, strongly typed code.
- State assumptions explicitly when requirements are missing.
- Use `pnpm safe-push` for AI-driven pushes.
- Commit messages must stay under 140 characters.

## Current Roadmap

- Add tests around backend cache behavior, rate limiting, validation, and single-flight request deduplication.
- Add frontend venue fixture loading and seating map rendering.
- Add frontend API integration once backend contracts are stable.
- Add CI after local verification commands are stable.

## Completed Major Slices

- Initialized local git repository on `main`.
- Added minimal README for the assignment.
- Added Node, pnpm, build output, env, logs, editor, and local-memory ignore rules.
- Added root `package.json` with pnpm pin.
- Added `pnpm-workspace.yaml` with `apps/*` and `packages/*`.
- Added durable and local Codex context system.
- Added versioned safe-push workflow and contributor documentation.
- Added TypeScript monorepo scaffold with `apps/web`, `apps/api`, and `packages/shared`.
- Pushed `main` to the GitHub `origin` remote.
- Implemented backend user API with in-memory LRU cache, metrics, rate limiting, queue-backed mock fetches, and centralized errors.

## Important Decisions

- Use repo-driven memory through `AGENTS.md` and `docs/project-state.md`.
- Use ignored local working memory at `docs/_local/current-session.md`.
- Keep root package private because this is a workspace repo, not a package intended for registry publication.
- Version Git hooks under `.githooks` and apply them locally with `pnpm setup:githooks`.
- Safe-push verification runs the root `pnpm build` script before pushing.
- Use Vite for the React frontend and Express for the backend API.
- `main` tracks `origin/main`.
- In-memory cache and queue are acceptable for the take-home; production multi-instance deployments would use shared infrastructure such as Redis and an external queue.

## Deferred / Not Yet Implemented

- No data model, database, authentication, or deployment target has been implemented.
- Frontend seating map rendering and API integration are not implemented yet.
- No test runner, formatter, or CI workflow has been added.

## Risks / Watchouts

- Corepack may need to download `pnpm@10.13.1` before pnpm commands work on a fresh machine.
- Avoid creating shared packages before there is a real reuse boundary.
- Avoid adding data storage, auth, or background job libraries before the assignment requirements require them.
- In-memory rate limiting and cache state are process-local and reset on restart.

## Standard Verification

- `git status --short --branch`
- `git remote -v`
- `pnpm --version`
- `pnpm -w list --depth -1`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm verify:push`
- `pnpm safe-push`
