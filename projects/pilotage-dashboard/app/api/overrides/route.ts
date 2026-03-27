import { NextResponse } from 'next/server';
import { upsertOverride } from '@/lib/repository';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    upsertOverride(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Override KO' }, { status: 400 });
  }
}
