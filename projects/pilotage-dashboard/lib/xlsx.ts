import * as XLSX from 'xlsx';
import { KPI_CODES, SCOPES } from './types';

const scopeSet = new Set(SCOPES);
const kpiSet = new Set(KPI_CODES);

export function parseWorkbook(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  return rows
    .map((row) => ({
      scope: String(row.scope || row.Scope || '').trim().toUpperCase(),
      kpiCode: String(row.kpiCode || row.kpi_code || row.KPI || '').trim().toUpperCase(),
      period: String(row.period || row.PERIOD || row.mois || '').trim(),
      value: Number(row.value || row.valeur || row.VALUE || 0),
    }))
    .filter((row) => scopeSet.has(row.scope as any) && kpiSet.has(row.kpiCode as any) && row.period);
}
