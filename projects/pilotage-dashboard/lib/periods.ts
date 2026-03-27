const MONTHS = [
  'JANVIER',
  'FEVRIER',
  'MARS',
  'AVRIL',
  'MAI',
  'JUIN',
  'JUILLET',
  'AOUT',
  'SEPTEMBRE',
  'OCTOBRE',
  'NOVEMBRE',
  'DECEMBRE',
] as const;

const MONTH_LABELS: Record<string, string> = {
  '01': 'Janvier',
  '02': 'Février',
  '03': 'Mars',
  '04': 'Avril',
  '05': 'Mai',
  '06': 'Juin',
  '07': 'Juillet',
  '08': 'Août',
  '09': 'Septembre',
  '10': 'Octobre',
  '11': 'Novembre',
  '12': 'Décembre',
};

export function normalizeText(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

export function extractMonthIndex(sheetName: string) {
  const normalized = normalizeText(sheetName);
  const monthIndex = MONTHS.findIndex((month) => normalized === month);
  return monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : null;
}

export function formatPeriod(year: number, month: string) {
  return `${year}-${month}`;
}

export function formatPeriodLabel(period: string) {
  const match = period.match(/^(\d{4})-(\d{2})$/);
  if (!match) return period;
  const [, year, month] = match;
  return `${MONTH_LABELS[month] || month} ${year}`;
}

export function comparePeriods(a: string, b: string) {
  return a.localeCompare(b);
}
