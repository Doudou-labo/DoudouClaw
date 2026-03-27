'use client';

import { useState } from 'react';

export function OverrideForm({
  scope,
  kpiCode,
  period,
  currentValue,
  note,
}: {
  scope: string;
  kpiCode: string;
  period: string;
  currentValue: number;
  note?: string | null;
}) {
  const [value, setValue] = useState(String(currentValue));
  const [message, setMessage] = useState('');
  const [noteValue, setNoteValue] = useState(note || '');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Enregistrement...');

    const response = await fetch('/api/overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope, kpiCode, period, value, note: noteValue }),
    });

    const data = await response.json();
    setMessage(response.ok ? 'Override sauvegardé ✅' : data.error || 'Erreur');
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2 md:grid-cols-[120px_1fr_auto] md:items-center">
      <input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" />
      <input value={noteValue} onChange={(e) => setNoteValue(e.target.value)} placeholder="Note override" />
      <button className="bg-indigo-600 hover:bg-indigo-500" type="submit">Sauver</button>
      {message ? <p className="md:col-span-3 text-xs text-slate-400">{message}</p> : null}
    </form>
  );
}
