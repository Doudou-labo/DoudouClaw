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
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Importer un XLSX</h2>
        <p className="mt-1 text-sm text-slate-400">Colonnes attendues : scope, kpiCode, period, value.</p>
      </div>
      <input type="file" name="file" accept=".xlsx,.xls" required />
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500">Lancer l'import</button>
      {status ? <p className="text-sm text-slate-300">{status}</p> : null}
    </form>
  );
}
