# Project State

## Product

`interactive-seating-map-user-api` is a backend API project for an interactive seating map take-home assignment. No application code exists yet.

## Current Architecture

- Repository is a pnpm workspace skeleton.
- Root package is private and pins `pnpm@10.13.1` through `packageManager`.
- Workspace packages are planned under `apps/*` and `packages/*`.
- Current committed files are `README.md`, `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `AGENTS.md`, and this project state file.
- There are no apps, packages, TypeScript configs, runtime dependencies, scripts, tests, CI workflows, or deployment files yet.

## Non-Negotiable Rules

- Use pnpm.
- Keep the TypeScript monorepo structure aligned with `apps/*` and `packages/*`.
- Do not add application code before the foundation is intentionally defined.
- Do not store secrets in repo memory or local session memory.
- Keep `docs/project-state.md` durable, concise, and focused on architecture, roadmap, constraints, and important decisions.
- Keep `docs/_local/current-session.md` local and ignored.
- No comments in code unless truly necessary.
- Use descriptive, consistent names and maintain modular, testable, strongly typed code.
- State assumptions explicitly when requirements are missing.
- Commit messages must stay under 140 characters.

## Current Roadmap

- Establish the TypeScript monorepo foundation.
- Add a backend API app under `apps/*`.
- Add shared packages under `packages/*` only when a real cross-app or cross-module boundary exists.
- Add validation, error handling, tests, and verification scripts before building feature slices.
- Implement the interactive seating map user API after the foundation is in place.

## Completed Major Slices

- Initialized local git repository on `main`.
- Added minimal README for the assignment.
- Added Node, pnpm, build output, env, logs, editor, and local-memory ignore rules.
- Added root `package.json` with pnpm pin.
- Added `pnpm-workspace.yaml` with `apps/*` and `packages/*`.
- Added durable and local Codex context system.

## Important Decisions

- Use repo-driven memory through `AGENTS.md` and `docs/project-state.md`.
- Use ignored local working memory at `docs/_local/current-session.md`.
- Keep the repo empty of application code until the monorepo foundation is set.
- Keep root package private because this is a workspace repo, not a package intended for registry publication.

## Deferred / Not Yet Implemented

- GitHub remote and public repository are not configured in this checkout.
- TypeScript configuration is not present.
- No API framework has been selected.
- No data model, database, authentication, or deployment target has been implemented.
- No test runner, linter, formatter, or CI workflow has been added.
- No lockfile exists yet.

## Risks / Watchouts

- GitHub CLI exists locally, but authentication is currently invalid for account `waqasraza123`.
- There is no `origin` remote, so pushes cannot succeed until the public GitHub repo is created and remote is set.
- Corepack may need to download `pnpm@10.13.1` before pnpm commands work on a fresh machine.
- Avoid creating shared packages before there is a real reuse boundary.
- Avoid choosing API, database, or validation libraries without confirming assignment requirements.

## Standard Verification

- `git status --short --branch`
- `git remote -v`
- `pnpm --version`
- `pnpm -w list --depth -1`
