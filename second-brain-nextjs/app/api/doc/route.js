import { NextResponse } from 'next/server';
import { getDocByPath } from '../../../lib/indexer';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || '';
  if (!path) return NextResponse.json({ error: 'missing path' }, { status: 400 });
  const doc = getDocByPath(path);
  if (!doc) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(doc);
}
