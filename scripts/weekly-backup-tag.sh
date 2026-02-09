#!/usr/bin/env bash
set -euo pipefail

cd /root/.openclaw/workspace
TAG="backup-$(date -u +%Y-%m-%d)"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists"
  exit 0
fi

git tag -a "$TAG" -m "Weekly backup snapshot $TAG"
git push origin "$TAG"
echo "Created and pushed $TAG"
