import { ImportForm } from '@/components/import-form';
import { listImports } from '@/lib/repository';

export default function ImportsPage() {
  const imports = listImports();

  return (
    <div className="space-y-6">
      <ImportForm />
      <section className="card table-wrap overflow-x-auto">
        <h2 className="mb-4 text-xl font-semibold">Historique</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fichier</th>
              <th>Quand</th>
              <th>Lignes</th>
            </tr>
          </thead>
          <tbody>
            {imports.length ? imports.map((item: any) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.filename}</td>
                <td>{item.importedAt}</td>
                <td>{item.rowCount}</td>
              </tr>
            )) : <tr><td colSpan={4}>Aucun import pour le moment.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
