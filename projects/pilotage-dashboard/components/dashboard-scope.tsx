import { KPI_CODES, KpiRow, Scope } from '@/lib/types';
import { ChartCard } from './chart-card';
import { OverrideForm } from './override-form';

function groupByKpi(rows: KpiRow[]) {
  return KPI_CODES.map((kpiCode) => ({
    kpiCode,
    rows: rows.filter((row) => row.kpiCode === kpiCode),
  })).filter((item) => item.rows.length > 0);
}

export function DashboardScope({ scope, rows }: { scope: Scope; rows: KpiRow[] }) {
  const grouped = groupByKpi(rows);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold">Scope {scope}</h2>
        <p className="mt-2 text-sm text-slate-400">Source active : dernier import + overrides manuels.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {grouped.slice(0, 4).map(({ kpiCode, rows }) => (
          <ChartCard key={kpiCode} title={kpiCode} rows={rows} />
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
                <td>{row.period}</td>
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
    </div>
  );
}
