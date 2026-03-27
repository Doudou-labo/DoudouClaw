'use client';

import { useState } from 'react';

export function ImportForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus('Import en cours...');
    const response = await fetch('/api/imports', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setStatus(response.ok ? `Import OK : ${data.rows} lignes (${data.filename})` : data.error || 'Erreur');
    if (response.ok) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="panel panel--accent space-y-5">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Alimentation du cockpit</p>
          <h2>Importer le classeur de pilotage</h2>
        </div>
        <div className="status-chip">XLSX / XLS • extraction auto des périodes</div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            Dépose ici le fichier source du tableau de pilotage. Le parseur lit le classeur réel, détecte les mois et alimente les scopes
            <strong> AGENCE</strong>, <strong>VL</strong> et <strong>PL</strong>.
          </p>
          <ul className="bullet-list">
            <li>Le dernier import devient la base de lecture de tout le cockpit.</li>
            <li>Les overrides manuels sont conservés et repassent au-dessus de l’import.</li>
            <li>Utilise cette zone pour recharger proprement une nouvelle extraction mensuelle.</li>
          </ul>
        </div>

        <div className="upload-box">
          <input type="file" name="file" accept=".xlsx,.xls" required />
          <button type="submit" className="btn-primary">Lancer l’import</button>
          <p className="upload-box__hint">Un import propre = des vues cohérentes sur tous les scopes.</p>
        </div>
      </div>

      {status ? <p className="text-sm text-slate-200">{status}</p> : null}
    </form>
  );
}
