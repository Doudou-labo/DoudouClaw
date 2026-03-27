import { KpiRow, Scope } from './types';
import { comparePeriods } from './periods';

export const KPI_LABELS: Record<string, string> = {
  CA: 'Chiffre d’affaires',
  PS: 'Prestations / services',
  MARGE: 'Marge',
  OBJECTIF_EVOLUTION: 'Objectif évolution',
  OBJECTIF_N: 'Objectif N',
  OBJECTIF_JOURNALIER: 'Objectif journalier',
  RESTE_A_FAIRE: 'Reste à faire',
  ATTERRISSAGE_FDM: 'Atterrissage fin de mois',
  COMPARAISON_N_1: 'Comparaison N-1',
};

export const KPI_UNIT: Record<string, 'currency' | 'percent' | 'number'> = {
  CA: 'currency',
  PS: 'currency',
  MARGE: 'currency',
  OBJECTIF_EVOLUTION: 'percent',
  OBJECTIF_N: 'currency',
  OBJECTIF_JOURNALIER: 'currency',
  RESTE_A_FAIRE: 'currency',
  ATTERRISSAGE_FDM: 'currency',
  COMPARAISON_N_1: 'currency',
};

export function formatKpiLabel(code: string) {
  return KPI_LABELS[code] || code;
}

export function formatValue(value: number, unit?: 'currency' | 'percent' | 'number') {
  if (!Number.isFinite(value)) return '—';
  if (unit === 'percent') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: Math.abs(value) < 1 ? 1 : 0,
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (unit === 'currency') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
}

export function buildScopeSummary(rows: KpiRow[], scope: Scope) {
  const periods = [...new Set(rows.map((row) => row.period))].sort(comparePeriods);
  const latestPeriod = periods[periods.length - 1];
  const latestRows = rows.filter((row) => row.period === latestPeriod);
  const getValue = (code: string) => latestRows.find((row) => row.kpiCode === code)?.value ?? 0;
  const currentCa = getValue('CA');
  const target = getValue('OBJECTIF_N');
  const landing = getValue('ATTERRISSAGE_FDM');
  const comparison = getValue('COMPARAISON_N_1');
  const remainder = getValue('RESTE_A_FAIRE');
  const overrides = rows.filter((row) => row.source === 'override').length;

  return {
    scope,
    periods,
    latestPeriod,
    rowCount: rows.length,
    overrides,
    currentCa,
    target,
    landing,
    comparison,
    remainder,
    attainmentRate: target ? currentCa / target : 0,
    landingGap: landing - target,
    comparisonGap: currentCa - comparison,
  };
}

export function buildPeriodMatrix(rows: KpiRow[]) {
  const periods = [...new Set(rows.map((row) => row.period))].sort(comparePeriods);
  const codes = [...new Set(rows.map((row) => row.kpiCode))];
  return periods.map((period, index) => {
    const previousPeriod = periods[index - 1];
    const getRow = (code: string) => rows.find((row) => row.period === period && row.kpiCode === code);
    const previousValue = (code: string) => rows.find((row) => row.period === previousPeriod && row.kpiCode === code)?.value;

    const currentCa = getRow('CA')?.value ?? 0;
    const target = getRow('OBJECTIF_N')?.value ?? 0;
    const comparison = getRow('COMPARAISON_N_1')?.value ?? 0;
    const landing = getRow('ATTERRISSAGE_FDM')?.value ?? 0;

    return {
      period,
      codes,
      rows: codes.map((code) => {
        const row = getRow(code);
        const current = row?.value ?? 0;
        const previous = previousValue(code);
        return {
          code,
          row,
          current,
          previous,
          delta: typeof previous === 'number' ? current - previous : null,
        };
      }),
      currentCa,
      target,
      comparison,
      landing,
      progress: target ? currentCa / target : 0,
      gapVsTarget: currentCa - target,
      gapVsN1: currentCa - comparison,
      landingGap: landing - target,
      overrideCount: codes.filter((code) => getRow(code)?.source === 'override').length,
    };
  });
}

export function getDeltaTone(value: number | null, invert = false) {
  if (value === null || value === 0) return 'neutral';
  const positive = invert ? value < 0 : value > 0;
  return positive ? 'good' : 'bad';
}
