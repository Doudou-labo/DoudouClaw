import * as XLSX from 'xlsx';
import { formatPeriod, extractMonthIndex, normalizeText } from './periods';
import { KPI_CODES, KpiCode, SCOPES, Scope } from './types';

const scopeSet = new Set(SCOPES);
const kpiSet = new Set(KPI_CODES);

const COLUMN_TO_KPI: Record<string, KpiCode> = {
  'REALISE N-1': 'COMPARAISON_N_1',
  'OBJECTIF EVOLUTION': 'OBJECTIF_EVOLUTION',
  'OBJECTIF JOURNALIER': 'OBJECTIF_JOURNALIER',
  'OBJECTIF N': 'OBJECTIF_N',
  'RESTE A FAIRE': 'RESTE_A_FAIRE',
  'ATTERRISSAGE FDM': 'ATTERRISSAGE_FDM',
};

const ROW_TO_KPI: Record<string, KpiCode> = {
  CA: 'CA',
  PS: 'PS',
  MARGE: 'MARGE',
};

function toNumber(value: unknown) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(',', '.');

  if (!normalized || normalized.startsWith('#')) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferWorkbookYear(workbook: XLSX.WorkBook) {
  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, defval: '' });
    for (const row of rows) {
      for (const cell of row) {
        if (cell instanceof Date && Number.isFinite(cell.getFullYear())) {
          return cell.getFullYear();
        }
        if (typeof cell === 'string') {
          const match = cell.match(/\b(20\d{2})-\d{2}-\d{2}\b/);
          if (match) return Number(match[1]);
        }
      }
    }
  }

  return new Date().getFullYear();
}

function findHeaderMap(headerRow: unknown[]) {
  const map = new Map<KpiCode, number>();

  headerRow.forEach((cell, index) => {
    const normalized = normalizeText(cell);
    const kpiCode = COLUMN_TO_KPI[normalized];
    if (kpiCode) {
      map.set(kpiCode, index);
    }
  });

  return map;
}

function parseMonthlySheet(sheetName: string, rows: unknown[][], year: number) {
  const monthIndex = extractMonthIndex(sheetName);
  if (!monthIndex) return [];

  const period = formatPeriod(year, monthIndex);
  const parsedRows: Array<{ scope: Scope; kpiCode: KpiCode; period: string; value: number }> = [];

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const firstCell = normalizeText(rows[rowIndex]?.[0]);
    if (!scopeSet.has(firstCell as Scope)) {
      continue;
    }

    const scope = firstCell as Scope;
    const headerMap = findHeaderMap(rows[rowIndex]);
    let blockMetricRowCaptured = false;

    for (let dataIndex = rowIndex + 1; dataIndex < rows.length; dataIndex += 1) {
      const currentRow = rows[dataIndex] || [];
      const currentKey = normalizeText(currentRow[0]);

      if (!currentKey) {
        break;
      }

      if (scopeSet.has(currentKey as Scope)) {
        break;
      }

      const baseKpi = ROW_TO_KPI[currentKey];
      if (!baseKpi) {
        continue;
      }

      const baseValue = toNumber(currentRow[1]);
      if (baseValue !== null) {
        parsedRows.push({ scope, kpiCode: baseKpi, period, value: baseValue });
      }

      if (!blockMetricRowCaptured) {
        for (const [kpiCode, columnIndex] of headerMap.entries()) {
          const value = toNumber(currentRow[columnIndex]);
          if (value !== null) {
            parsedRows.push({ scope, kpiCode, period, value });
          }
        }
        blockMetricRowCaptured = true;
      }
    }
  }

  return parsedRows;
}

export function parseWorkbook(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const year = inferWorkbookYear(workbook);

  const rows = workbook.SheetNames.flatMap((sheetName) => {
    const monthIndex = extractMonthIndex(sheetName);
    if (!monthIndex) {
      return [];
    }

    const sheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
    return parseMonthlySheet(sheetName, sheetRows, year);
  });

  const deduped = new Map<string, { scope: Scope; kpiCode: KpiCode; period: string; value: number }>();
  for (const row of rows) {
    if (!kpiSet.has(row.kpiCode)) {
      continue;
    }
    deduped.set(`${row.scope}::${row.kpiCode}::${row.period}`, row);
  }

  return Array.from(deduped.values()).sort((a, b) => {
    return a.period.localeCompare(b.period) || a.scope.localeCompare(b.scope) || a.kpiCode.localeCompare(b.kpiCode);
  });
}
