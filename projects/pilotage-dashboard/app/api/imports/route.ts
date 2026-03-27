import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { createImport } from '@/lib/repository';
import { parseWorkbook } from '@/lib/xlsx';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Fichier XLSX manquant.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rows = parseWorkbook(buffer);

    if (!rows.length) {
      return NextResponse.json({ error: 'Aucune ligne valide trouvée dans le XLSX.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    createImport(filename, rows);

    return NextResponse.json({ ok: true, filename, rows: rows.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import KO' }, { status: 500 });
  }
}
