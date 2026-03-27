import db from './db';
import { comparePeriods } from './periods';
import { importRowSchema, overrideSchema } from './schema';
import { KpiRow, Scope } from './types';

export function listImports() {
  return db.prepare(`SELECT id, filename, imported_at as importedAt, row_count as rowCount FROM imports ORDER BY id DESC`).all();
}

export function createImport(filename: string, rows: unknown[]) {
  const insertImport = db.prepare('INSERT INTO imports (filename, row_count) VALUES (?, ?)');
  const insertSnapshot = db.prepare(
    'INSERT INTO kpi_snapshots (import_id, scope, kpi_code, period, value) VALUES (?, ?, ?, ?, ?)'
  );

  const tx = db.transaction((safeRows: unknown[]) => {
    const result = insertImport.run(filename, safeRows.length);
    const importId = Number(result.lastInsertRowid);

    for (const row of safeRows) {
      const parsed = importRowSchema.parse(row);
      insertSnapshot.run(importId, parsed.scope, parsed.kpiCode, parsed.period, parsed.value);
    }

    return importId;
  });

  return tx(rows);
}

export function upsertOverride(payload: unknown) {
  const parsed = overrideSchema.parse(payload);

  db.prepare(`
    INSERT INTO kpi_overrides (scope, kpi_code, period, value, note, updated_at)
    VALUES (@scope, @kpiCode, @period, @value, @note, CURRENT_TIMESTAMP)
    ON CONFLICT(scope, kpi_code, period)
    DO UPDATE SET value = excluded.value, note = excluded.note, updated_at = CURRENT_TIMESTAMP
  `).run(parsed);
}

export function getDashboardRows(scope: Scope, period?: string): KpiRow[] {
  const rows = db.prepare(`
    WITH latest_import AS (
      SELECT id FROM imports ORDER BY id DESC LIMIT 1
    )
    SELECT
      s.scope as scope,
      s.kpi_code as kpiCode,
      s.period as period,
      COALESCE(o.value, s.value) as value,
      CASE WHEN o.id IS NOT NULL THEN 'override' ELSE 'import' END as source,
      s.import_id as importBatchId,
      o.updated_at as overriddenAt,
      o.note as notes
    FROM kpi_snapshots s
    JOIN latest_import li ON li.id = s.import_id
    LEFT JOIN kpi_overrides o
      ON o.scope = s.scope
      AND o.kpi_code = s.kpi_code
      AND o.period = s.period
    WHERE s.scope = ?
    ORDER BY s.period ASC, s.kpi_code ASC
  `).all(scope) as KpiRow[];

  return period ? rows.filter((row) => row.period === period) : rows;
}

export function getAvailablePeriods() {
  return db.prepare(`
    WITH latest_import AS (
      SELECT id FROM imports ORDER BY id DESC LIMIT 1
    )
    SELECT DISTINCT period
    FROM kpi_snapshots
    WHERE import_id = (SELECT id FROM latest_import)
    ORDER BY period ASC
  `).pluck().all() as string[];
}

export function getOverview() {
  const periods = getAvailablePeriods().sort(comparePeriods);

  return {
    AGENCE: getDashboardRows('AGENCE'),
    VL: getDashboardRows('VL'),
    PL: getDashboardRows('PL'),
    periods,
    imports: listImports(),
  };
}
