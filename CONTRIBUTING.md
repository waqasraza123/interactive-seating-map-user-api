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

The verifier runs the workspace build and blocks the push if `pnpm build` fails.
