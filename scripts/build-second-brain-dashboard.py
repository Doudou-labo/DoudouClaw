#!/usr/bin/env python3
import json
import os
from pathlib import Path
from datetime import datetime, UTC

ROOT = Path('/root/.openclaw/workspace')
OUT_DIR = ROOT / 'second-brain'
OUT_DIR.mkdir(exist_ok=True)

SOURCES = [
    ('MEMORY', ROOT / 'MEMORY.md'),
    ('SESSION', ROOT / 'SESSION-STATE.md'),
    ('RECENT', ROOT / 'RECENT_CONTEXT.md'),
]

for p in (ROOT / 'memory').glob('*.md'):
    SOURCES.append(('DAILY', p))
for p in (ROOT / 'notes').rglob('*.md'):
    SOURCES.append(('PARA', p))

items = []
for typ, path in SOURCES:
    if not path.exists() or path.is_dir():
        continue
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    rel = str(path.relative_to(ROOT))
    for i, line in enumerate(text.splitlines(), start=1):
        line = line.strip()
        if len(line) < 20:
            continue
        if line.startswith('#'):
            continue
        items.append({
            'type': typ,
            'path': rel,
            'line': i,
            'text': line,
            'dateHint': rel[7:17] if rel.startswith('memory/') and len(rel) >= 17 else ''
        })

payload = {
    'generatedAt': datetime.now(UTC).isoformat(),
    'count': len(items),
    'items': items,
}

(OUT_DIR / 'data.json').write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')

html = '''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Second Brain — Doudou</title>
  <style>
    body{font-family:Inter,system-ui,sans-serif;background:#0b1020;color:#e6eaf2;margin:0}
    .wrap{max-width:1100px;margin:24px auto;padding:0 16px}
    .card{background:#111832;border:1px solid #283159;border-radius:12px;padding:14px}
    input,select{background:#0f1630;color:#e6eaf2;border:1px solid #33406f;border-radius:8px;padding:10px}
    .grid{display:grid;gap:10px;grid-template-columns:1fr 160px 160px}
    .row{padding:10px;border-bottom:1px solid #25305a}
    .meta{font-size:12px;color:#aab5d6}
    .txt{margin-top:4px}
  </style>
</head>
<body>
<div class="wrap">
  <h1>🧠 Second Brain — Doudou</h1>
  <p id="gen" class="meta"></p>
  <div class="card" style="margin-bottom:12px">
    <div class="grid">
      <input id="q" placeholder="Cmd/Ctrl+K pour chercher..." />
      <select id="type"><option value="">Tous types</option></select>
      <input id="date" placeholder="YYYY-MM-DD" />
    </div>
  </div>
  <div class="card"><div id="list"></div></div>
</div>
<script>
let data=[];
const q=document.getElementById('q'), type=document.getElementById('type'), date=document.getElementById('date'), list=document.getElementById('list');
window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();q.focus();}});
function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}
function render(){
  const qq=q.value.toLowerCase().trim();
  const tt=type.value; const dd=date.value.trim();
  const rows=data.filter(x=>(!tt||x.type===tt)&&(!dd||x.dateHint===dd)&&(!qq||(`${x.text} ${x.path}`.toLowerCase().includes(qq)))).slice(0,400);
  list.innerHTML=rows.map(x=>`<div class='row'><div class='meta'>${x.type} • ${x.path}:${x.line}</div><div class='txt'>${esc(x.text)}</div></div>`).join('') || '<div class="row">Aucun résultat</div>';
}
fetch('./data.json').then(r=>r.json()).then(j=>{
  data=j.items||[];
  document.getElementById('gen').textContent=`Index: ${j.count} entrées • généré: ${j.generatedAt}`;
  [...new Set(data.map(x=>x.type))].sort().forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;type.appendChild(o);});
  render();
});
[q,type,date].forEach(el=>el.addEventListener('input',render));
</script>
</body></html>'''

(OUT_DIR / 'index.html').write_text(html, encoding='utf-8')
print(f'OK: {len(items)} entrées indexées dans {OUT_DIR}')
