import Link from 'next/link';
import { formatPeriodLabel } from '@/lib/periods';
import { getOverview } from '@/lib/repository';
import { buildScopeSummary, formatValue } from '@/lib/dashboard';

export default function HomePage() {
  const overview = getOverview();
  const scopeCards = [
    buildScopeSummary(overview.AGENCE, 'AGENCE'),
    buildScopeSummary(overview.VL, 'VL'),
    buildScopeSummary(overview.PL, 'PL'),
  ];

  return (
    <div className="space-y-6">
      <section className="hero-grid">
        <div className="panel panel--accent hero-card">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Cockpit central</p>
              <h2>Vision globale des centres</h2>
            </div>
            <div className="status-chip">{overview.periods.length} périodes détectées</div>
          </div>

          <div className="hero-card__kpis hero-card__kpis--wide">
            <div>
              <span>Dernier mois chargé</span>
              <strong>{overview.periods.length ? formatPeriodLabel(overview.periods[overview.periods.length - 1]) : '—'}</strong>
            </div>
            <div>
              <span>Scopes actifs</span>
              <strong>3</strong>
            </div>
            <div>
              <span>Dernier import</span>
              <strong>{overview.imports[0]?.filename || 'Aucun'}</strong>
            </div>
            <div>
              <span>Lignes consolidées</span>
              <strong>{scopeCards.reduce((sum, item) => sum + item.rowCount, 0)}</strong>
            </div>
          </div>

          <div className="period-strip">
            {overview.periods.map((period) => (
              <span key={period} className="period-strip__item">{formatPeriodLabel(period)}</span>
            ))}
          </div>
        </div>

        <aside className="panel sidebar-panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Rythme d’alimentation</p>
              <h3>Derniers imports</h3>
            </div>
          </div>
          <div className="mini-log">
            {overview.imports.length ? overview.imports.slice(0, 5).map((item: any) => (
              <div key={item.id} className="mini-log__item">
                <strong>#{item.id}</strong>
                <span>{item.filename}</span>
                <small>{item.rowCount} lignes • {item.importedAt}</small>
              </div>
            )) : <p className="text-sm text-slate-300">Aucun import pour le moment.</p>}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {scopeCards.map((item) => (
          <Link key={item.scope} href={`/${item.scope.toLowerCase()}`} className="scope-card">
            <div className="scope-card__head">
              <div>
                <p className="eyebrow">Scope</p>
                <h3>{item.scope}</h3>
              </div>
              <span className="badge badge--neutral">{item.rowCount} lignes</span>
            </div>
            <div className="scope-card__grid">
              <div>
                <span>CA</span>
                <strong>{formatValue(item.currentCa, 'currency')}</strong>
              </div>
              <div>
                <span>Objectif</span>
                <strong>{formatValue(item.target, 'currency')}</strong>
              </div>
              <div>
                <span>Atterrissage</span>
                <strong>{formatValue(item.landing, 'currency')}</strong>
              </div>
              <div>
                <span>Vs N-1</span>
                <strong className={item.comparisonGap >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(item.comparisonGap, 'currency')}</strong>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="panel panel--table overflow-x-auto">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Synthèse rapide</p>
            <h3>Lecture direction</h3>
          </div>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Scope</th>
              <th>Dernier mois</th>
              <th>CA</th>
              <th>Objectif N</th>
              <th>Atterrissage FDM</th>
              <th>Vs N-1</th>
              <th>Overrides</th>
            </tr>
          </thead>
          <tbody>
            {scopeCards.map((item) => (
              <tr key={`summary-${item.scope}`}>
                <td><strong>{item.scope}</strong></td>
                <td>{item.latestPeriod ? formatPeriodLabel(item.latestPeriod) : '—'}</td>
                <td>{formatValue(item.currentCa, 'currency')}</td>
                <td>{formatValue(item.target, 'currency')}</td>
                <td>{formatValue(item.landing, 'currency')}</td>
                <td className={item.comparisonGap >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{formatValue(item.comparisonGap, 'currency')}</td>
                <td>{item.overrides}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
