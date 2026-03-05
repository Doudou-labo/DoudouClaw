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
  if (/^[-_*|`:\s]+$/.test(t)) return false; // séparateurs décoratifs
  const letters = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (letters < 8) return false;
  return true;
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
    .filter((v) => !v.includes('/notes/resources/templates/')); // trop de bruit template

  const items = [];
  for (const file of files) {
    const rel = file.replace(`${ROOT}/`, '');
    const type = rel.startsWith('memory/') ? 'DAILY' : rel.startsWith('notes/') ? 'PARA' : rel === 'MEMORY.md' ? 'MEMORY' : 'SESSION';
    const lines = fs.readFileSync(file, 'utf8').split('\n');

    let section = '';
    let block = [];
    let blockStart = 1;

    const flushBlock = () => {
      const joined = block.join(' ').replace(/\s+/g, ' ').trim();
      block = [];
      if (joined.length < 20) return;
      if (!isMeaningful(joined)) return;
      items.push({
        id: `${rel}:${blockStart}`,
        type,
        path: rel,
        line: blockStart,
        text: section ? `${section} — ${joined}` : joined,
        date: rel.startsWith('memory/') ? rel.slice(7, 17) : '',
      });
    };

    lines.forEach((raw, idx) => {
      const line = raw.trim();
      const ln = idx + 1;

      if (!line) {
        flushBlock();
        return;
      }

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

  // de-dup visuel: même texte + même fichier + même section
  const seen = new Set();
  return items.filter((it) => {
    const key = `${it.path}::${it.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
