'use client';
import { useEffect, useMemo, useState } from 'react';

const categoryIcon = {
  decisions: '⚖️',
  projects: '🚀',
  people: '👤',
  knowledge: '🧠',
  procedures: '📋',
  episodes: '📖',
  handoffs: '🤝',
  inbox: '📥',
  daily: '📝',
  'memory-md': '📌',
  'session-state': '⚡',
  'recent-context': '🕒',
  'para-projects': '📂',
  'para-areas': '🗂️',
  'para-resources': '📚',
  'para-archive': '🧳',
};

export default function Page() {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState('keyword');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState({ totalDocs: 0, categories: [], latestDocs: [] });
  const [searchData, setSearchData] = useState({ count: 0, categories: [], items: [] });
  const [semanticData, setSemanticData] = useState({ count: 0, items: [], ok: true, raw: '' });
  const [selectedPath, setSelectedPath] = useState('');
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    fetch('/api/summary').then((r) => r.json()).then(setSummary).catch(() => {});
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams({ q, category, date });
    fetch(`/api/search?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setSearchData)
      .catch(() => {});
    return () => ctrl.abort();
  }, [q, category, date]);

  useEffect(() => {
    if (mode === 'keyword' || !q.trim()) {
      setSemanticData({ count: 0, items: [], ok: true, raw: '' });
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/semantic?q=${encodeURIComponent(q)}&mode=${mode}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setSemanticData)
      .catch(() => {});
    return () => ctrl.abort();
  }, [q, mode]);

  useEffect(() => {
    const nextPath = selectedPath || searchData.items[0]?.path || summary.latestDocs[0]?.path;
    if (!nextPath) return;
    const ctrl = new AbortController();
    fetch(`/api/doc?path=${encodeURIComponent(nextPath)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((payload) => {
        if (!payload?.error) {
          setSelectedPath(nextPath);
          setDoc(payload);
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [selectedPath, searchData.items, summary.latestDocs]);

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

  const resultItems = useMemo(() => {
    if (mode === 'keyword') return searchData.items;
    return semanticData.items.map((x, i) => ({ id: `${x.path}:${i}`, path: x.path, title: x.title || x.path, text: (x.snippets || []).slice(0, 3).join(' '), categoryLabel: '🔎 Sémantique', date: '', line: '' }));
  }, [mode, searchData.items, semanticData.items]);

  return (
    <main className="shell">
      <aside className="sidebar card">
        <div className="brand">
          <div>
            <h1>🧠 Second Brain</h1>
            <p>DoudouClaw • mémoire centrale</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><strong>{summary.totalDocs}</strong><span>documents</span></div>
          <div className="stat"><strong>{summary.categories.length}</strong><span>catégories</span></div>
          <div className="stat"><strong>{searchData.count}</strong><span>matchs mot-clé</span></div>
        </div>

        <div className="sectionTitle">Catégories</div>
        <button className={`navItem ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>✨ Tout</button>
        {summary.categories.map((c) => (
          <button key={c.key} className={`navItem ${category === c.key ? 'active' : ''}`} onClick={() => setCategory(c.key)}>
            <span>{categoryIcon[c.key] || '•'} {c.label}</span>
            <span className="count">{c.count}</span>
          </button>
        ))}

        <div className="sectionTitle">Récents</div>
        <div className="recentList">
          {summary.latestDocs.map((d) => (
            <button key={d.path} className={`recentItem ${selectedPath === d.path ? 'active' : ''}`} onClick={() => setSelectedPath(d.path)}>
              <div className="recentTitle">{d.title}</div>
              <div className="recentMeta">{d.categoryLabel} • {d.date || 'sans date'}</div>
            </button>
          ))}
        </div>
      </aside>

      <section className="main">
        <section className="hero card">
          <div>
            <h2>Dashboard mémoire</h2>
            <p>Recherche mot-clé, sémantique et navigation par catégories `fsxmemory` / PARA.</p>
          </div>
          <div className="heroBadges">
            <span className="badge">Cmd/Ctrl + K</span>
            <span className="badge">qmd</span>
            <span className="badge">fsxmemory</span>
          </div>
        </section>

        <section className="search card">
          <div className="searchGrid">
            <input id="search" className="input" placeholder="Rechercher une décision, un projet, une personne..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="keyword">Mot-clé</option>
              <option value="semantic">Sémantique</option>
              <option value="deep">Deep / reranking</option>
            </select>
            <input className="input" placeholder="YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </section>

        <section className="contentGrid">
          <section className="results card">
            <div className="panelHead">
              <h3>{mode === 'keyword' ? 'Résultats' : 'Recherche sémantique'}</h3>
              <div className="meta">{mode === 'keyword' ? `${searchData.count} résultats` : `${semanticData.count} résultats`}</div>
            </div>

            {mode !== 'keyword' && !semanticData.ok && (
              <div className="warning">qmd a renvoyé une erreur :<br />{semanticData.raw}</div>
            )}

            <div className="resultList">
              {resultItems.map((x) => (
                <button key={x.id} className={`resultItem ${selectedPath === x.path ? 'active' : ''}`} onClick={() => setSelectedPath(x.path)}>
                  <div className="resultMeta">{x.categoryLabel || 'Résultat'} • {x.path}{x.line ? `:${x.line}` : ''}</div>
                  <div className="resultTitle">{x.title || x.path}</div>
                  <div className="resultText">{x.text}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="detail card">
            <div className="panelHead">
              <h3>Détail</h3>
              {doc && <div className="meta">{doc.categoryLabel} • {doc.date || 'sans date'}</div>}
            </div>
            {doc ? (
              <>
                <div className="docTitle">{doc.title}</div>
                <div className="docPath">{doc.path}</div>
                <pre className="docContent">{doc.content}</pre>
              </>
            ) : (
              <div className="empty">Sélectionne un document pour afficher son contenu.</div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
