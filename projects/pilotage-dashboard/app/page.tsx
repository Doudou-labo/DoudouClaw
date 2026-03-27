import Link from 'next/link';
import { getOverview } from '@/lib/repository';

export default function HomePage() {
  const overview = getOverview();

  const cards: Array<{ scope: 'AGENCE' | 'VL' | 'PL'; count: number }> = [
    { scope: 'AGENCE', count: overview.AGENCE.length },
    { scope: 'VL', count: overview.VL.length },
    { scope: 'PL', count: overview.PL.length },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map(({ scope, count }) => (
          <Link key={scope} href={`/${scope.toLowerCase()}`} className="card hover:border-indigo-400">
            <p className="text-sm text-slate-400">Scope</p>
            <h2 className="mt-2 text-2xl font-bold">{scope}</h2>
            <p className="mt-3 text-sm">{count} lignes exploitables</p>
          </Link>
        ))}
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">Derniers imports</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {overview.imports.length ? overview.imports.map((item: any) => (
            <li key={item.id}>#{item.id} — {item.filename} — {item.rowCount} lignes — {item.importedAt}</li>
          )) : <li>Aucun import pour le moment.</li>}
        </ul>
      </section>
    </div>
  );
}
