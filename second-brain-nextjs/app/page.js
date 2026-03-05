'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [data, setData] = useState({ count: 0, types: [], items: [] });

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams({ q, type, date });
    fetch(`/api/search?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
    return () => ctrl.abort();
  }, [q, type, date]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="wrap">
      <h1 className="title">🧠 Second Brain — Doudou</h1>
      <p className="subtitle">
        Notes, conversations et mémoires — recherche globale <span className="kbd">Cmd/Ctrl + K</span>
      </p>

      <section className="card" style={{ marginBottom: 12 }}>
        <div className="grid">
          <input id="search" className="input" placeholder="Rechercher partout..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous types</option>
            {data.types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input className="input" placeholder="YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </section>

      <section className="card">
        <div className="meta" style={{ marginBottom: 8 }}>
          {data.count} entrées indexées • {data.items.length} résultats affichés
        </div>
        {data.items.map((x) => (
          <article key={x.id} className="row">
            <div className="path">{x.type} • {x.path}:{x.line}</div>
            <div>{x.text}</div>
          </article>
        ))}
      </section>
    </main>
  );
}
