export const SCOPES = ['AGENCE', 'VL', 'PL'] as const;
export const KPI_CODES = [
  'CA',
  'PS',
  'MARGE',
  'OBJECTIF_EVOLUTION',
  'OBJECTIF_N',
  'OBJECTIF_JOURNALIER',
  'RESTE_A_FAIRE',
  'ATTERRISSAGE_FDM',
  'COMPARAISON_N_1',
] as const;

export type Scope = (typeof SCOPES)[number];
export type KpiCode = (typeof KPI_CODES)[number];

export type KpiRow = {
  scope: Scope;
  kpiCode: KpiCode;
  period: string;
  value: number;
  source: 'import' | 'override';
  importBatchId?: number | null;
  overriddenAt?: string | null;
  notes?: string | null;
};
