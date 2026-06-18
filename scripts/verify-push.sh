#!/usr/bin/env sh
set -eu

root="$(git rev-parse --show-toplevel)"
cd "$root"

echo "verify-push: checking pnpm"
pnpm --version

echo "verify-push: checking workspace"
pnpm -w list --depth -1

if node -e "const pkg = require('./package.json'); process.exit(pkg.scripts && pkg.scripts.build ? 0 : 1);"; then
  echo "verify-push: running pnpm build"
  pnpm build
else
  echo "verify-push: no build script configured; skipping build"
fi

echo "verify-push: ok"
