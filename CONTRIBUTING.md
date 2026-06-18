# Contributing

## Safe Push Workflow

This repository uses versioned Git hooks from `.githooks`.

Run this once after cloning:

```sh
pnpm setup:githooks
```

Before pushing, use the AI-friendly wrapper:

```sh
pnpm safe-push
```

The wrapper runs `scripts/verify-push.sh` before pushing. The versioned `pre-push` hook runs the same verifier for normal `git push`.

At this stage the repository does not have a `build` script. The verifier reports that honestly and skips build verification. When the monorepo scaffold adds a real `build` script, `scripts/verify-push.sh` will run `pnpm build` and block pushes if it fails.
