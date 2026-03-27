import Link from 'next/link';
import { KPI_CODES, KpiRow, Scope } from '@/lib/types';
import { formatPeriodLabel } from '@/lib/periods';
import { ChartCard } from './chart-card';
import { OverrideForm } from './override-form';

function groupByKpi(rows: KpiRow[]) {
  return KPI_CODES.map((kpiCode) => ({
    kpiCode,
    rows: rows.filter((row) => row.kpiCode === kpiCode),
  })).filter((item) => item.rows.length > 0);
}

export function DashboardScope({
  scope,
  rows,
  periods,
  selectedPeriod,
}: {
  scope: Scope;
  rows: KpiRow[];
  periods: string[];
  selectedPeriod?: string;
}) {
  const grouped = groupByKpi(rows);

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Scope {scope}</h2>
          <p className="mt-2 text-sm text-slate-400">Source active : dernier import + overrides manuels.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${scope.toLowerCase()}`}
            className={`rounded-lg border px-3 py-2 text-sm ${!selectedPeriod ? 'border-indigo-400 text-white' : 'border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white'}`}
          >
            Toutes les périodes
          </Link>
          {periods.map((period) => {
            const active = period === selectedPeriod;
            return (
              <Link
                key={period}
                href={`/${scope.toLowerCase()}?period=${encodeURIComponent(period)}`}
                className={`rounded-lg border px-3 py-2 text-sm ${active ? 'border-indigo-400 text-white' : 'border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white'}`}
              >
                {formatPeriodLabel(period)}
              </Link>
            );
          })}
        </div>
      </div>

      {grouped.length ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {grouped.slice(0, 4).map(({ kpiCode, rows: kpiRows }) => (
              <ChartCard key={kpiCode} title={kpiCode} rows={kpiRows} />
            ))}
          </div>

          <div className="card table-wrap overflow-x-auto">
            <h3 className="mb-4 text-lg font-semibold">Valeurs éditables</h3>
            <table>
              <thead>
                <tr>
                  <th>Période</th>
                  <th>KPI</th>
                  <th>Valeur active</th>
                  <th>Source</th>
                  <th>Override</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.scope}-${row.period}-${row.kpiCode}`}>
                    <td>{formatPeriodLabel(row.period)}</td>
                    <td>{row.kpiCode}</td>
                    <td>{row.value}</td>
                    <td>
                      <span className={row.source === 'override' ? 'text-amber-400' : 'text-emerald-400'}>{row.source}</span>
                    </td>
                    <td>
                      <OverrideForm
                        scope={row.scope}
                        kpiCode={row.kpiCode}
                        period={row.period}
                        currentValue={row.value}
                        note={row.notes}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card text-sm text-slate-300">Aucune donnée pour cette période.</div>
      )}
    </div>
  );
}
