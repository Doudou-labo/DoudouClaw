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

export function buildIndex() {
  const files = [
    path.join(ROOT, 'MEMORY.md'),
    path.join(ROOT, 'SESSION-STATE.md'),
    path.join(ROOT, 'RECENT_CONTEXT.md'),
    ...collectFiles(path.join(ROOT, 'memory')),
    ...collectFiles(path.join(ROOT, 'notes')),
  ].filter((v, i, a) => a.indexOf(v) === i && fs.existsSync(v));

  const items = [];
  for (const file of files) {
    const rel = file.replace(`${ROOT}/`, '');
    const type = rel.startsWith('memory/') ? 'DAILY' : rel.startsWith('notes/') ? 'PARA' : rel === 'MEMORY.md' ? 'MEMORY' : 'SESSION';
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      const text = line.trim();
      if (text.length < 12 || text.startsWith('#')) return;
      items.push({
        id: `${rel}:${idx + 1}`,
        type,
        path: rel,
        line: idx + 1,
        text,
        date: rel.startsWith('memory/') ? rel.slice(7, 17) : '',
      });
    });
  }
  return items;
}
