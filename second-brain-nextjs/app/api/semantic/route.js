import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
export const dynamic = 'force-dynamic';

async function runQmd(args) {
  try {
    const { stdout, stderr } = await execFileAsync('qmd', args, { timeout: 30000, maxBuffer: 1024 * 1024 * 4 });
    return { ok: true, output: `${stdout || ''}${stderr || ''}`.trim() };
  } catch (error) {
    return { ok: false, output: error?.stdout || error?.stderr || error?.message || 'qmd error' };
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const mode = searchParams.get('mode') || 'semantic';
  if (!q) return NextResponse.json({ count: 0, mode, items: [] });

  const args = mode === 'deep' ? ['query', q, '-c', 'memory'] : ['vsearch', q, '-c', 'memory'];
  const result = await runQmd(args);
  const lines = result.output.split('\n').map((x) => x.trim()).filter(Boolean);

  const items = [];
  let current = null;
  for (const line of lines) {
    const pathMatch = line.match(/^qmd:\/\/memory\/(.+?)\s+#/);
    if (pathMatch) {
      if (current) items.push(current);
      current = { path: `memory/${pathMatch[1]}`, snippets: [] };
      continue;
    }
    if (/^Title:/i.test(line)) {
      if (current) current.title = line.replace(/^Title:\s*/i, '');
      continue;
    }
    if (/^Score:/i.test(line)) {
      if (current) current.score = line.replace(/^Score:\s*/i, '');
      continue;
    }
    if (current && !/^(Context:|Model:|Embedding |QMD Warning|\[node-llama-cpp\]|CMAKE_|-- |ERROR OMG|Call Stack|at )/.test(line)) {
      current.snippets.push(line);
    }
  }
  if (current) items.push(current);

  return NextResponse.json({ count: items.length, mode, ok: result.ok, raw: result.ok ? '' : result.output.slice(0, 1200), items: items.slice(0, 20) });
}
