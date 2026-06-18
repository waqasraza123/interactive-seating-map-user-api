#!/usr/bin/env sh
set -eu

root="$(git rev-parse --show-toplevel)"
cd "$root"

echo "verify-push: checking pnpm"
pnpm --version

echo "verify-push: checking workspace"
pnpm -w list --depth -1

echo "verify-push: running pnpm format:check"
pnpm format:check

echo "verify-push: running pnpm lint"
pnpm lint

echo "verify-push: running pnpm typecheck"
pnpm typecheck

echo "verify-push: running pnpm test"
pnpm test

echo "verify-push: running pnpm build"
pnpm build

echo "verify-push: ok"
