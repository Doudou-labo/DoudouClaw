import { NextResponse } from 'next/server';
import { buildIndex } from '../../../lib/indexer';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const type = searchParams.get('type') || '';
  const date = searchParams.get('date') || '';

  const all = buildIndex();
  const types = [...new Set(all.map((x) => x.type))].sort();

  const toTs = (d) => {
    if (!d) return 0;
    const t = Date.parse(`${d}T00:00:00Z`);
    return Number.isNaN(t) ? 0 : t;
  };

  const items = all
    .filter((x) => (!type || x.type === type))
    .filter((x) => (!date || x.date === date))
    .filter((x) => !q || `${x.text} ${x.path}`.toLowerCase().includes(q))
    .sort((a, b) => {
      const ta = toTs(a.date);
      const tb = toTs(b.date);
      if (ta !== tb) return tb - ta; // décroissant: plus récent d'abord
      if (a.path !== b.path) return b.path.localeCompare(a.path);
      return b.line - a.line;
    })
    .slice(0, 500);

  return NextResponse.json({ count: all.length, types, items });
}
