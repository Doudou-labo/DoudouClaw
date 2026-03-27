import Link from 'next/link';
import { ChartCard } from './chart-card';
import { OverrideForm } from './override-form';
import { formatPeriodLabel } from '@/lib/periods';
import { KpiRow, KPI_CODES, Scope } from '@/lib/types';
import { buildPeriodMatrix, buildScopeSummary, formatKpiLabel, formatValue, getDeltaTone, KPI_UNIT } from '@/lib/dashboard';

function toneClass(tone: string) {
  if (tone === 'good') return 'badge badge--good';
  if (tone === 'bad') return 'badge badge--bad';
  return 'badge badge--neutral';
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
  const summary = buildScopeSummary(rows, scope);
  const matrix = buildPeriodMatrix(rows);
  const latestRows = rows.filter((row) => row.period === summary.latestPeriod);
  const visibleRows = selectedPeriod ? rows.filter((row) => row.period === selectedPeriod) : latestRows;
  const periodSnapshot = matrix.find((item) => item.period === (selectedPeriod || summary.latestPeriod));
  const latestGrouped = KPI_CODES
    .filter((code) => code !== 'OBJECTIF_N')
    .map((code) => latestRows.find((row) => row.kpiCode === code))
    .filter(Boolean) as KpiRow[];

  return (
    <div className="space-y-6">
      <section className="hero-grid">
        <div className="panel panel--accent hero-card">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Scope métier</p>
              <h2>{scope}</h2>
            </div>
            <div className="status-chip">{summary.rowCount} lignes visibles</div>
          </div>

          <div className="hero-card__kpis">
            <div>
              <span>Dernière période</span>
              <strong>{summary.latestPeriod ? formatPeriodLabel(summary.latestPeriod) : '—'}</strong>
            </div>
            <div>
              <span>CA courant</span>
              <strong>{formatValue(summary.currentCa, 'currency')}</strong>
            </div>
            <div>
              <span>Objectif N</span>
              <strong>{formatValue(summary.target, 'currency')}</strong>
            </div>
            <div>
              <span>Overrides</span>
              <strong>{summary.overrides}</strong>
            </div>
          </div>

          <div className="hero-card__status">
            <div className="status-block">
              <span>Taux d’atteinte</span>
              <strong>{formatValue(summary.attainmentRate, 'percent')}</strong>
            </div>
            <div className="status-block">
              <span>Écart objectif</span>
              <strong className={summary.landingGap >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(summary.landingGap, 'currency')}</strong>
            </div>
            <div className="status-block">
              <span>Vs N-1</span>
              <strong className={summary.comparisonGap >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(summary.comparisonGap, 'currency')}</strong>
            </div>
            <div className="status-block">
              <span>Reste à faire</span>
              <strong>{formatValue(summary.remainder, 'currency')}</strong>
            </div>
          </div>
        </div>

        <aside className="panel sidebar-panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Périodes</p>
              <h3>Navigation mensuelle</h3>
            </div>
          </div>
          <div className="period-rail">
            <Link href={`/${scope.toLowerCase()}`} className={`period-pill ${!selectedPeriod ? 'is-active' : ''}`}>
              Toutes les périodes
            </Link>
            {periods.map((period) => {
              const active = period === selectedPeriod;
              return (
                <Link key={period} href={`/${scope.toLowerCase()}?period=${encodeURIComponent(period)}`} className={`period-pill ${active ? 'is-active' : ''}`}>
                  <span>{formatPeriodLabel(period)}</span>
                  <small>{rows.filter((row) => row.period === period).length} KPI</small>
                </Link>
              );
            })}
          </div>
        </aside>
      </section>

      {rows.length ? (
        <>
          <section className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-2">
            {visibleRows.map((row) => {
              const unit = KPI_UNIT[row.kpiCode];
              const refValue =
                row.kpiCode === 'CA'
                  ? periodSnapshot?.target ?? null
                  : row.kpiCode === 'ATTERRISSAGE_FDM'
                    ? periodSnapshot?.target ?? null
                    : row.kpiCode === 'RESTE_A_FAIRE'
                      ? 0
                      : periodSnapshot?.rows.find((item) => item.code === row.kpiCode)?.previous ?? null;
              const delta = typeof refValue === 'number' ? row.value - refValue : null;
              const invert = row.kpiCode === 'RESTE_A_FAIRE' || row.kpiCode === 'OBJECTIF_JOURNALIER';
              return (
                <article key={`${row.scope}-${row.period}-${row.kpiCode}`} className="metric-card">
                  <div className="metric-card__head">
                    <div>
                      <p className="metric-card__kpi">{formatKpiLabel(row.kpiCode)}</p>
                      <h3>{formatValue(row.value, unit)}</h3>
                    </div>
                    <span className={row.source === 'override' ? 'badge badge--warning' : 'badge badge--neutral'}>{row.source}</span>
                  </div>
                  <div className="metric-card__foot">
                    <span>{formatPeriodLabel(row.period)}</span>
                    <span className={toneClass(getDeltaTone(delta, invert))}>
                      {delta === null ? 'Sans référence' : `${delta >= 0 ? '+' : ''}${formatValue(delta, unit)}`}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="panel panel--table overflow-x-auto">
              <div className="panel__header">
                <div>
                  <p className="eyebrow">Lecture mensuelle</p>
                  <h3>Matrice de pilotage</h3>
                </div>
                <div className="status-chip">{matrix.length} périodes consolidées</div>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Période</th>
                    <th>CA</th>
                    <th>Objectif</th>
                    <th>Atterrissage</th>
                    <th>Vs objectif</th>
                    <th>Vs N-1</th>
                    <th>Overrides</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((item) => {
                    const statusTone = getDeltaTone(item.gapVsTarget);
                    return (
                      <tr key={item.period} className={item.period === selectedPeriod ? 'is-highlighted' : ''}>
                        <td>
                          <div className="table-period">
                            <strong>{formatPeriodLabel(item.period)}</strong>
                            <span>{formatValue(item.progress, 'percent')} atteint</span>
                          </div>
                        </td>
                        <td>{formatValue(item.currentCa, 'currency')}</td>
                        <td>{formatValue(item.target, 'currency')}</td>
                        <td>{formatValue(item.landing, 'currency')}</td>
                        <td className={item.gapVsTarget >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(item.gapVsTarget, 'currency')}</td>
                        <td className={item.gapVsN1 >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(item.gapVsN1, 'currency')}</td>
                        <td>{item.overrideCount}</td>
                        <td><span className={toneClass(statusTone)}>{statusTone === 'good' ? 'Dans le vert' : statusTone === 'bad' ? 'Sous cible' : 'Neutre'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="panel space-y-4">
              <div className="panel__header">
                <div>
                  <p className="eyebrow">Réglages métier</p>
                  <h3>Overrides manuels</h3>
                </div>
                <div className="status-chip">{visibleRows.filter((row) => row.source === 'override').length} actifs</div>
              </div>
              <div className="override-list">
                {visibleRows.map((row) => (
                  <div key={`override-${row.scope}-${row.period}-${row.kpiCode}`} className="override-card">
                    <div className="override-card__head">
                      <div>
                        <strong>{formatKpiLabel(row.kpiCode)}</strong>
                        <p>{formatPeriodLabel(row.period)}</p>
                      </div>
                      <span className={row.source === 'override' ? 'badge badge--warning' : 'badge badge--neutral'}>{row.source}</span>
                    </div>
                    <OverrideForm scope={row.scope} kpiCode={row.kpiCode} period={row.period} currentValue={row.value} note={row.notes} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            {latestGrouped.slice(0, 6).map((row) => (
              <ChartCard key={row.kpiCode} title={row.kpiCode} rows={rows.filter((item) => item.kpiCode === row.kpiCode)} />
            ))}
          </section>
        </>
      ) : (
        <div className="panel text-sm text-slate-300">Aucune donnée pour cette période.</div>
      )}
    </div>
  );
}
