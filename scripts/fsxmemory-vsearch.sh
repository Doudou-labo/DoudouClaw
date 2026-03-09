#!/usr/bin/env bash
# fsxmemory vsearch — recherche sémantique dans le vault via qmd
# Usage: fsxmemory-vsearch.sh "query" [--deep]
# --deep : utilise qmd query (hybride BM25 + vector + reranking, meilleure qualité)
set -euo pipefail

QUERY="${1:-}"
DEEP=false

shift 1 2>/dev/null || true
[[ "${1:-}" == "--deep" ]] && DEEP=true

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"search query\" [--deep]"
  echo ""
  echo "  (default) qmd vsearch  — recherche sémantique vector"
  echo "  --deep    qmd query    — hybride BM25 + vector + reranking (meilleure qualité, plus lent)"
  exit 1
fi

if $DEEP; then
  echo "🔬 Deep search (hybride + reranking): \"$QUERY\""
  echo "========================================"
  qmd query "$QUERY" -c memory 2>&1
else
  echo "🧠 Semantic search: \"$QUERY\""
  echo "=============================="
  qmd vsearch "$QUERY" -c memory 2>&1
fi
