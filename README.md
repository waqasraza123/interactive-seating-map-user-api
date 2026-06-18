# interactive-seating-map-user-api

Full-stack take-home assignment for an interactive event seating map.

## Workspace

- `apps/web`: Vite, React, and TypeScript frontend shell.
- `apps/api`: Express and TypeScript backend API with a health route.
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
