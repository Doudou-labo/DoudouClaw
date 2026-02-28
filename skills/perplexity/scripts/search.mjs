#!/usr/bin/env node
// search.mjs — Perplexity Search avec filtre fraîcheur + citations
// Usage: search.mjs "query" [--freshness day|week|month] [--json] [--urls-only]

const args = process.argv.slice(2);

const queries = [];
let jsonOutput = false;
let urlsOnly = false;
let freshness = "week"; // défaut : 7 jours

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--json") {
    jsonOutput = true;
  } else if (arg === "--urls-only") {
    urlsOnly = true;
  } else if (arg === "--freshness" && args[i + 1]) {
    freshness = args[++i]; // day | week | month
  } else if (!arg.startsWith("-")) {
    queries.push(arg);
  }
}

if (queries.length === 0) {
  console.error("Usage: search.mjs <query> [query2...] [--freshness day|week|month] [--json] [--urls-only]");
  process.exit(1);
}

const apiKey = process.env.PERPLEXITY_API_KEY;
if (!apiKey) {
  console.error("Error: PERPLEXITY_API_KEY environment variable not set");
  process.exit(1);
}

async function searchOne(query) {
  const body = {
    model: "sonar",
    messages: [{ role: "user", content: query }],
    search_recency_filter: freshness,
    return_citations: true,
    max_tokens: 1024,
  };

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error (${response.status}): ${error}`);
  }

  return response.json();
}

function formatResult(data, query) {
  const lines = [];
  const content = data?.choices?.[0]?.message?.content || "";
  const citations = data?.citations || [];

  if (query) lines.push(`## ${query}\n`);

  if (content) lines.push(content);

  if (citations.length > 0) {
    lines.push("\n### 🔗 Sources\n");
    citations.slice(0, 8).forEach((url, i) => {
      lines.push(`${i + 1}. ${url}`);
    });
  }

  return lines.join("\n");
}

function extractUrls(data) {
  return data?.citations || [];
}

try {
  const allUrls = [];

  for (const query of queries) {
    const result = await searchOne(query);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else if (urlsOnly) {
      const urls = extractUrls(result);
      urls.forEach(u => console.log(u));
      allUrls.push(...urls);
    } else {
      console.log(formatResult(result, queries.length > 1 ? query : null));
      console.log("");
    }
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
