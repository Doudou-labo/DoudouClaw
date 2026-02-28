---
name: perplexity
description: Search the web with AI-powered answers via Perplexity MCP server. Returns grounded responses with citations. Supports batch queries.
homepage: https://docs.perplexity.ai
metadata: {"clawdbot":{"emoji":"🔮","requires":{"bins":["node"],"env":["PERPLEXITY_API_KEY"]},"primaryEnv":"PERPLEXITY_API_KEY"}}
---

# Perplexity Search

AI-powered web search that returns grounded answers with citations.

## Search

Single query:
```bash
node {baseDir}/scripts/search.mjs "what's happening in AI today"
```

Multiple queries (batch):
```bash
node {baseDir}/scripts/search.mjs "What is Perplexity?" "Latest AI news" "Best coffee in NYC"
```

## Options ⚙️

- `--mode ask|reason|research|search`: Choose MCP tool (default: `research` 🔬)
- `--freshness day|week|month|hour|year`: Filter by recency (default: `week`)
- `--urls-only`: Output citations URLs only 🔗
- `--json`: Output raw MCP tool response

## Notes

- Requires `PERPLEXITY_API_KEY` environment variable
- Uses the official MCP server: `@perplexity-ai/mcp-server`
- Responses include citations when available
- Batch queries are executed sequentially in one CLI run
