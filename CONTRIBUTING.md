# Contributing

## Safe Push Workflow

This repository uses versioned Git hooks from `.githooks`.

Run this once after cloning:

```sh
pnpm setup:githooks
```

Before pushing, use the repository wrapper:

```sh
pnpm safe-push
```

The wrapper runs `scripts/verify-push.sh` before pushing. The versioned `pre-push` hook runs the same verifier for normal `git push`.

The verifier runs the final local checks and blocks the push if any command fails:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Formatting

Use Prettier before committing broad documentation or code edits:

```sh
pnpm format
```

Check formatting without writing files:

```sh
pnpm format:check
```

## Continuous Integration

GitHub Actions runs the same verification commands on pushes to `main` and pull requests after:

```sh
pnpm install --frozen-lockfile
```
