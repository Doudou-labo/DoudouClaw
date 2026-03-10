import { NextResponse } from 'next/server';
import { buildSummary } from '../../../lib/indexer';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(buildSummary());
}
