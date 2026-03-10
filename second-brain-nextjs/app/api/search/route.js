import { NextResponse } from 'next/server';
import { buildIndex } from '../../../lib/indexer';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';
  const bucket = searchParams.get('bucket') || '';

  const { items, docs } = buildIndex();
  const categories = [...new Map(docs.map((d) => [d.category, { key: d.category, label: d.categoryLabel }])).values()].sort((a, b) => a.label.localeCompare(b.label));

  const sorted = items
    .filter((x) => (!category || x.category === category))
    .filter((x) => (!bucket || x.bucket === bucket))
    .filter((x) => (!date || x.date === date))
    .filter((x) => !q || `${x.title} ${x.text} ${x.path}`.toLowerCase().includes(q))
    .sort((a, b) => {
      if ((a.date || '') !== (b.date || '')) return (b.date || '').localeCompare(a.date || '');
      if (a.path !== b.path) return a.path.localeCompare(b.path);
      return a.line - b.line;
    });

  return NextResponse.json({ count: sorted.length, categories, items: sorted.slice(0, 300) });
}
