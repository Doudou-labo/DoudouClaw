#!/usr/bin/env node
// search.mjs — Perplexity via MCP server (officiel) 🔮
// Usage: search.mjs "query" [--mode ask|reason|research|search] [--freshness day|week|month|hour|year] [--json] [--urls-only]

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const args = process.argv.slice(2);

const queries = [];
let jsonOutput = false;
let urlsOnly = false;
let mode = "research"; // défaut : deep research 🔬
let freshness = "week"; // défaut : 7 jours

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--json") {
    jsonOutput = true;
  } else if (arg === "--urls-only") {
    urlsOnly = true;
  } else if (arg === "--mode" && args[i + 1]) {
    mode = args[++i]; // ask | reason | research | search
  } else if (arg === "--freshness" && args[i + 1]) {
    freshness = args[++i]; // hour | day | week | month | year
  } else if (!arg.startsWith("-")) {
    queries.push(arg);
  }
}

if (queries.length === 0) {
  console.error("Usage: search.mjs <query> [query2...] [--mode ask|reason|research|search] [--freshness day|week|month|hour|year] [--json] [--urls-only]");
  process.exit(1);
}

const validModes = new Set(["ask", "reason", "research", "search"]);
if (!validModes.has(mode)) {
  console.error(`Error: invalid --mode '${mode}'. Use one of: ask, reason, research, search`);
  process.exit(1);
}

const validFreshness = new Set(["hour", "day", "week", "month", "year"]);
if (!validFreshness.has(freshness)) {
  console.error(`Error: invalid --freshness '${freshness}'. Use one of: hour, day, week, month, year`);
  process.exit(1);
}

if (!process.env.PERPLEXITY_API_KEY) {
  console.error("Error: PERPLEXITY_API_KEY environment variable not set");
  process.exit(1);
}

function extractUrls(text = "") {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) || [];
  const deduped = [];
  const seen = new Set();
  for (const url of matches) {
    if (!seen.has(url)) {
      seen.add(url);
      deduped.push(url);
    }
  }
  return deduped;
}

function formatResult(content, query) {
  const lines = [];
  const urls = extractUrls(content);

  if (query) lines.push(`## ${query}\n`);
  if (content) lines.push(content.trim());

  // Si le modèle n'a pas explicitement section "Citations", on ajoute nos URLs détectées
  if (urls.length > 0 && !/\bCitations?\b/i.test(content)) {
    lines.push("\n### 🔗 Sources\n");
    urls.slice(0, 8).forEach((url, i) => {
      lines.push(`${i + 1}. ${url}`);
    });
  }

  return lines.join("\n");
}

async function main() {
  const client = new Client({ name: "perplexity-skill-cli", version: "2.0.0" });
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-yq", "@perplexity-ai/mcp-server"],
    env: process.env,
  });

  try {
    await client.connect(transport);

    const modeToTool = {
      ask: "perplexity_ask",
      reason: "perplexity_reason",
      research: "perplexity_research",
      search: "perplexity_search",
    };

    for (const query of queries) {
      const toolName = modeToTool[mode];
      const toolArgs = mode === "search"
        ? {
            query,
            max_results: 10,
          }
        : {
            messages: [{ role: "user", content: query }],
            search_recency_filter: freshness,
          };

      const result = await client.callTool({
        name: toolName,
        arguments: toolArgs,
      });

      const content = result?.structuredContent?.response
        || result?.content?.find((c) => c.type === "text")?.text
        || (result?.structuredContent ? JSON.stringify(result.structuredContent, null, 2) : "")
        || "";

      if (jsonOutput) {
        console.log(JSON.stringify(result, null, 2));
      } else if (urlsOnly) {
        extractUrls(content).forEach((u) => console.log(u));
      } else {
        console.log(formatResult(content, queries.length > 1 ? query : null));
        console.log("");
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    await client.close().catch(() => {});
  }
}

await main();
