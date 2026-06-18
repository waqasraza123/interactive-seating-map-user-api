#!/usr/bin/env sh
set -eu

root="$(git rev-parse --show-toplevel)"
cd "$root"

scripts/verify-push.sh

origin_url="$(git remote get-url origin 2>/dev/null || true)"

if [ -z "$origin_url" ]; then
  echo "safe-push: no origin remote configured"
  echo "safe-push: create the GitHub repo and set origin before pushing"
  exit 1
fi

git push --no-verify "$@"
