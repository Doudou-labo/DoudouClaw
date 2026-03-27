import { ImportForm } from '@/components/import-form';
import { listImports } from '@/lib/repository';

export default function ImportsPage() {
  const imports = listImports();

  return (
    <div className="space-y-6">
      <ImportForm />

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="metric-card">
          <p className="metric-card__kpi">Batches importés</p>
          <h3>{imports.length}</h3>
          <div className="metric-card__foot"><span>Historique total</span></div>
        </article>
        <article className="metric-card">
          <p className="metric-card__kpi">Dernier fichier</p>
          <h3>{imports[0]?.filename || '—'}</h3>
          <div className="metric-card__foot"><span>{imports[0]?.rowCount || 0} lignes</span></div>
        </article>
        <article className="metric-card">
          <p className="metric-card__kpi">Dernière injection</p>
          <h3>{imports[0]?.importedAt || '—'}</h3>
          <div className="metric-card__foot"><span>Base active du cockpit</span></div>
        </article>
      </section>

      <section className="panel panel--table overflow-x-auto">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Traçabilité</p>
            <h2>Historique des imports</h2>
          </div>
          <div className="status-chip">Le batch le plus récent alimente les vues métier</div>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fichier</th>
              <th>Horodatage</th>
              <th>Lignes</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {imports.length ? imports.map((item: any, index: number) => (
              <tr key={item.id} className={index === 0 ? 'is-highlighted' : ''}>
                <td><strong>#{item.id}</strong></td>
                <td>{item.filename}</td>
                <td>{item.importedAt}</td>
                <td>{item.rowCount}</td>
                <td><span className={index === 0 ? 'badge badge--good' : 'badge badge--neutral'}>{index === 0 ? 'Actif' : 'Archive batch'}</span></td>
              </tr>
            )) : <tr><td colSpan={5}>Aucun import pour le moment.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
