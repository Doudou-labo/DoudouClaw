import fs from 'fs';
import path from 'path';

const ROOT = '/root/.openclaw/workspace';

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(abs, out);
    else if (entry.name.endsWith('.md')) out.push(abs);
  }
  return out;
}

function isMeaningful(text) {
  const t = text.trim();
  if (!t) return false;
  if (/^[-_*|`:\s]+$/.test(t)) return false;
  const letters = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  return letters >= 8;
}

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return {};
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) return {};
  const block = content.slice(4, end).split('\n');
  const meta = {};
  for (const line of block) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    meta[m[1]] = m[2].replace(/^"|"$/g, '').trim();
  }
  return meta;
}

function classify(rel, meta = {}) {
  const byDir = [
    ['memory/people/', { bucket: 'fsxmemory', category: 'people', label: '👤 Personnes' }],
    ['memory/projects/', { bucket: 'fsxmemory', category: 'projects', label: '🚀 Projets' }],
    ['memory/knowledge/', { bucket: 'fsxmemory', category: 'knowledge', label: '🧠 Connaissances' }],
    ['memory/procedures/', { bucket: 'fsxmemory', category: 'procedures', label: '📋 Procédures' }],
    ['memory/decisions/', { bucket: 'fsxmemory', category: 'decisions', label: '⚖️ Décisions' }],
    ['memory/episodes/', { bucket: 'fsxmemory', category: 'episodes', label: '📖 Épisodes' }],
    ['memory/handoffs/', { bucket: 'fsxmemory', category: 'handoffs', label: '🤝 Handoffs' }],
    ['memory/inbox/', { bucket: 'fsxmemory', category: 'inbox', label: '📥 Inbox' }],
    ['notes/projects/', { bucket: 'para', category: 'para-projects', label: '📂 PARA Projets' }],
    ['notes/areas/', { bucket: 'para', category: 'para-areas', label: '🗂️ PARA Areas' }],
    ['notes/resources/', { bucket: 'para', category: 'para-resources', label: '📚 PARA Resources' }],
    ['notes/archive/', { bucket: 'para', category: 'para-archive', label: '🧳 PARA Archive' }],
  ];
  for (const [prefix, value] of byDir) {
    if (rel.startsWith(prefix)) return value;
  }
  if (rel.startsWith('memory/')) return { bucket: 'memory', category: 'daily', label: '📝 Journaux' };
  if (rel === 'MEMORY.md') return { bucket: 'core', category: 'memory-md', label: '📌 MEMORY.md' };
  if (rel === 'SESSION-STATE.md') return { bucket: 'core', category: 'session-state', label: '⚡ SESSION-STATE' };
  if (rel === 'RECENT_CONTEXT.md') return { bucket: 'core', category: 'recent-context', label: '🕒 RECENT_CONTEXT' };
  if (meta.type) return { bucket: 'other', category: meta.type, label: meta.type };
  return { bucket: 'other', category: 'other', label: 'Autres' };
}

export function buildIndex() {
  const files = [
    path.join(ROOT, 'MEMORY.md'),
    path.join(ROOT, 'SESSION-STATE.md'),
    path.join(ROOT, 'RECENT_CONTEXT.md'),
    ...collectFiles(path.join(ROOT, 'memory')),
    ...collectFiles(path.join(ROOT, 'notes')),
  ]
    .filter((v, i, a) => a.indexOf(v) === i && fs.existsSync(v))
    .filter((v) => !v.includes('/notes/resources/templates/'))
    .filter((v) => !v.includes('/openclaw-skills-registry/'));

  const items = [];
  const docs = [];

  for (const file of files) {
    const rel = file.replace(`${ROOT}/`, '');
    const raw = fs.readFileSync(file, 'utf8');
    const meta = parseFrontmatter(raw);
    const cls = classify(rel, meta);
    const lines = raw.split('\n');
    const titleLine = lines.find((l) => l.trim().startsWith('# '));
    const title = meta.title || titleLine?.replace(/^#+\s*/, '').trim() || path.basename(rel, '.md');
    const date = meta.date || (rel.startsWith('memory/') ? rel.slice(7, 17) : '');

    docs.push({
      id: rel,
      path: rel,
      title,
      date,
      bucket: cls.bucket,
      category: cls.category,
      categoryLabel: cls.label,
      meta,
      excerpt: lines.filter((l) => l.trim() && !l.startsWith('---')).slice(0, 6).join(' ').slice(0, 280),
      content: raw,
    });

    let section = '';
    let block = [];
    let blockStart = 1;

    const flushBlock = () => {
      const joined = block.join(' ').replace(/\s+/g, ' ').trim();
      block = [];
      if (joined.length < 20 || !isMeaningful(joined)) return;
      items.push({
        id: `${rel}:${blockStart}`,
        path: rel,
        line: blockStart,
        title,
        date,
        text: section ? `${section} — ${joined}` : joined,
        bucket: cls.bucket,
        category: cls.category,
        categoryLabel: cls.label,
        meta,
      });
    };

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      const ln = idx + 1;
      if (!line) {
        flushBlock();
        return;
      }
      if (line.startsWith('---')) return;
      if (line.startsWith('#')) {
        flushBlock();
        section = line.replace(/^#+\s*/, '').trim();
        return;
      }
      if (line.length < 3) return;
      const cleaned = line.replace(/^[-*]\s+/, '').trim();
      if (!isMeaningful(cleaned) && cleaned.length < 30) return;
      if (block.length === 0) blockStart = ln;
      block.push(cleaned);
    });
    flushBlock();
  }

  const seen = new Set();
  const dedupedItems = items.filter((it) => {
    const key = `${it.path}::${it.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { items: dedupedItems, docs };
}

export function buildSummary() {
  const { docs, items } = buildIndex();
  const byCategory = new Map();
  for (const doc of docs) {
    const key = doc.category;
    if (!byCategory.has(key)) byCategory.set(key, { key, label: doc.categoryLabel, count: 0 });
    byCategory.get(key).count += 1;
  }
  const categories = [...byCategory.values()].sort((a, b) => a.label.localeCompare(b.label));
  const latestDocs = [...docs]
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.path.localeCompare(b.path))
    .slice(0, 12);

  const pickLatest = (category, limit = 5) => docs
    .filter((d) => d.category === category)
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.path.localeCompare(b.path))
    .slice(0, limit);

  const openLoopsDoc = docs.find((d) => d.path === 'notes/areas/open-loops.md');
  const openLoopLines = (openLoopsDoc?.content || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    totalDocs: docs.length,
    totalChunks: items.length,
    categories,
    latestDocs,
    dashboard: {
      recentDecisions: pickLatest('decisions', 4),
      activeProjects: pickLatest('projects', 6),
      keyPeople: pickLatest('people', 4),
      latestHandoffs: pickLatest('handoffs', 4),
      openLoops: openLoopLines,
    },
  };
}

export function getDocByPath(targetPath) {
  return buildIndex().docs.find((d) => d.path === targetPath) || null;
}
