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

  const items = all
    .filter((x) => (!type || x.type === type))
    .filter((x) => (!date || x.date === date))
    .filter((x) => !q || `${x.text} ${x.path}`.toLowerCase().includes(q))
    .slice(0, 500);

  return NextResponse.json({ count: all.length, types, items });
}
