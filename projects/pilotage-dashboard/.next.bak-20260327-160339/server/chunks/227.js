exports.id=227,exports.ids=[227],exports.modules={9559:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,81170,23)),Promise.resolve().then(c.t.bind(c,23597,23)),Promise.resolve().then(c.t.bind(c,36893,23)),Promise.resolve().then(c.t.bind(c,89748,23)),Promise.resolve().then(c.t.bind(c,6060,23)),Promise.resolve().then(c.t.bind(c,7184,23)),Promise.resolve().then(c.t.bind(c,69576,23)),Promise.resolve().then(c.t.bind(c,73041,23)),Promise.resolve().then(c.t.bind(c,51384,23))},21231:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,54160,23)),Promise.resolve().then(c.t.bind(c,31603,23)),Promise.resolve().then(c.t.bind(c,68495,23)),Promise.resolve().then(c.t.bind(c,75170,23)),Promise.resolve().then(c.t.bind(c,77526,23)),Promise.resolve().then(c.t.bind(c,78922,23)),Promise.resolve().then(c.t.bind(c,29234,23)),Promise.resolve().then(c.t.bind(c,12263,23)),Promise.resolve().then(c.bind(c,82146))},21419:(a,b,c)=>{"use strict";c.d(b,{OM:()=>g,PS:()=>i,cA:()=>j,dH:()=>h,fQ:()=>f});let d=["JANVIER","FEVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOUT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DECEMBRE"],e={"01":"Janvier","02":"F\xe9vrier","03":"Mars","04":"Avril","05":"Mai","06":"Juin","07":"Juillet","08":"Ao\xfbt","09":"Septembre",10:"Octobre",11:"Novembre",12:"D\xe9cembre"};function f(a){return String(a??"").normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/\s+/g," ").trim().toUpperCase()}function g(a){let b=f(a),c=d.findIndex(a=>b===a);return c>=0?String(c+1).padStart(2,"0"):null}function h(a,b){return`${a}-${b}`}function i(a){let b=a.match(/^(\d{4})-(\d{2})$/);if(!b)return a;let[,c,d]=b;return`${e[d]||d} ${c}`}function j(a,b){return a.localeCompare(b)}},25145:(a,b,c)=>{"use strict";c.d(b,{OverrideForm:()=>d});let d=(0,c(97954).registerClientReference)(function(){throw Error("Attempted to call OverrideForm() from the server but OverrideForm is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/root/.openclaw/workspace/projects/pilotage-dashboard/components/override-form.tsx","OverrideForm")},34867:(a,b,c)=>{"use strict";c.d(b,{OverrideForm:()=>f});var d=c(21124),e=c(38301);function f({scope:a,kpiCode:b,period:c,currentValue:f,note:g}){let[h,i]=(0,e.useState)(String(f)),[j,k]=(0,e.useState)(""),[l,m]=(0,e.useState)(g||"");async function n(d){d.preventDefault(),k("Enregistrement...");let e=await fetch("/api/overrides",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scope:a,kpiCode:b,period:c,value:h,note:l})}),f=await e.json();k(e.ok?"Override sauvegard\xe9 ✅":f.error||"Erreur")}return(0,d.jsxs)("form",{onSubmit:n,className:"grid gap-2 md:grid-cols-[120px_1fr_auto] md:items-center",children:[(0,d.jsx)("input",{value:h,onChange:a=>i(a.target.value),inputMode:"decimal"}),(0,d.jsx)("input",{value:l,onChange:a=>m(a.target.value),placeholder:"Note override"}),(0,d.jsx)("button",{className:"bg-indigo-600 hover:bg-indigo-500",type:"submit",children:"Sauver"}),j?(0,d.jsx)("p",{className:"md:col-span-3 text-xs text-slate-400",children:j}):null]})}},43344:(a,b,c)=>{"use strict";c.d(b,{O:()=>e,i:()=>d});let d=["AGENCE","VL","PL"],e=["CA","PS","MARGE","OBJECTIF_EVOLUTION","OBJECTIF_N","OBJECTIF_JOURNALIER","RESTE_A_FAIRE","ATTERRISSAGE_FDM","COMPARAISON_N_1"]},53329:(a,b,c)=>{"use strict";c.d(b,{j:()=>k});var d=c(75338),e=c(65169),f=c.n(e),g=c(43344),h=c(21419),i=c(67691),j=c(25145);function k({scope:a,rows:b,periods:c,selectedPeriod:e}){let k=g.O.map(a=>({kpiCode:a,rows:b.filter(b=>b.kpiCode===a)})).filter(a=>a.rows.length>0);return(0,d.jsxs)("div",{className:"space-y-6",children:[(0,d.jsxs)("div",{className:"card space-y-4",children:[(0,d.jsxs)("div",{children:[(0,d.jsxs)("h2",{className:"text-2xl font-bold",children:["Scope ",a]}),(0,d.jsx)("p",{className:"mt-2 text-sm text-slate-400",children:"Source active : dernier import + overrides manuels."})]}),(0,d.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,d.jsx)(f(),{href:`/${a.toLowerCase()}`,className:`rounded-lg border px-3 py-2 text-sm ${!e?"border-indigo-400 text-white":"border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white"}`,children:"Toutes les p\xe9riodes"}),c.map(b=>{let c=b===e;return(0,d.jsx)(f(),{href:`/${a.toLowerCase()}?period=${encodeURIComponent(b)}`,className:`rounded-lg border px-3 py-2 text-sm ${c?"border-indigo-400 text-white":"border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-white"}`,children:(0,h.PS)(b)},b)})]})]}),k.length?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"grid gap-6 xl:grid-cols-2",children:k.slice(0,4).map(({kpiCode:a,rows:b})=>(0,d.jsx)(i.ChartCard,{title:a,rows:b},a))}),(0,d.jsxs)("div",{className:"card table-wrap overflow-x-auto",children:[(0,d.jsx)("h3",{className:"mb-4 text-lg font-semibold",children:"Valeurs \xe9ditables"}),(0,d.jsxs)("table",{children:[(0,d.jsx)("thead",{children:(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"P\xe9riode"}),(0,d.jsx)("th",{children:"KPI"}),(0,d.jsx)("th",{children:"Valeur active"}),(0,d.jsx)("th",{children:"Source"}),(0,d.jsx)("th",{children:"Override"})]})}),(0,d.jsx)("tbody",{children:b.map(a=>(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:(0,h.PS)(a.period)}),(0,d.jsx)("td",{children:a.kpiCode}),(0,d.jsx)("td",{children:a.value}),(0,d.jsx)("td",{children:(0,d.jsx)("span",{className:"override"===a.source?"text-amber-400":"text-emerald-400",children:a.source})}),(0,d.jsx)("td",{children:(0,d.jsx)(j.OverrideForm,{scope:a.scope,kpiCode:a.kpiCode,period:a.period,currentValue:a.value,note:a.notes})})]},`${a.scope}-${a.period}-${a.kpiCode}`))})]})]})]}):(0,d.jsx)("div",{className:"card text-sm text-slate-300",children:"Aucune donn\xe9e pour cette p\xe9riode."})]})}},54481:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>j,metadata:()=>i});var d=c(75338);c(82704);var e=c(65169),f=c.n(e);let g=[["/","Accueil"],["/agence","Agence"],["/vl","VL"],["/pl","PL"],["/imports","Imports"]];function h(){return(0,d.jsx)("nav",{className:"flex flex-wrap gap-2",children:g.map(([a,b])=>(0,d.jsx)(f(),{href:a,className:"rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-indigo-400 hover:text-white",children:b},a))})}let i={title:"Pilotage Dashboard",description:"Dashboard de pilotage Euromaster V1"};function j({children:a}){return(0,d.jsx)("html",{lang:"fr",children:(0,d.jsx)("body",{children:(0,d.jsxs)("main",{className:"mx-auto min-h-screen max-w-7xl px-6 py-8",children:[(0,d.jsxs)("header",{className:"mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("h1",{className:"text-3xl font-bold",children:"pilotage.doudougen.xyz"}),(0,d.jsx)("p",{className:"mt-2 text-sm text-slate-400",children:"MVP V1 corrig\xe9 — scopes AGENCE / VL / PL, imports XLSX, overrides manuels."})]}),(0,d.jsx)(h,{})]}),a]})})})}},60974:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,3991,23))},62512:(a,b,c)=>{Promise.resolve().then(c.bind(c,67691)),Promise.resolve().then(c.bind(c,25145)),Promise.resolve().then(c.t.bind(c,65169,23))},65565:(a,b,c)=>{"use strict";c.d(b,{ChartCard:()=>l});var d=c(21124),e=c(44968),f=c(39465),g=c(57495),h=c(59296),i=c(16803),j=c(1179),k=c(94465);function l({title:a,rows:b}){return(0,d.jsxs)("div",{className:"card h-80",children:[(0,d.jsxs)("div",{className:"mb-4 flex items-center justify-between",children:[(0,d.jsx)("h3",{className:"text-lg font-semibold",children:a}),(0,d.jsxs)("span",{className:"text-xs text-slate-400",children:[b.length," points"]})]}),(0,d.jsx)(e.u,{width:"100%",height:"100%",children:(0,d.jsxs)(f.b,{data:b,children:[(0,d.jsx)(g.d,{stroke:"#1e293b"}),(0,d.jsx)(h.W,{dataKey:"period",stroke:"#94a3b8"}),(0,d.jsx)(i.h,{stroke:"#94a3b8"}),(0,d.jsx)(j.m,{contentStyle:{background:"#0f172a",border:"1px solid #334155"}}),(0,d.jsx)(k.N1,{type:"monotone",dataKey:"value",stroke:"#818cf8",strokeWidth:2,dot:{r:3}})]})})]})}},67691:(a,b,c)=>{"use strict";c.d(b,{ChartCard:()=>d});let d=(0,c(97954).registerClientReference)(function(){throw Error("Attempted to call ChartCard() from the server but ChartCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/root/.openclaw/workspace/projects/pilotage-dashboard/components/chart-card.tsx","ChartCard")},72240:(a,b,c)=>{Promise.resolve().then(c.bind(c,65565)),Promise.resolve().then(c.bind(c,34867)),Promise.resolve().then(c.t.bind(c,3991,23))},79309:(a,b,c)=>{"use strict";c.d(b,{aw:()=>s,iE:()=>v,M5:()=>u,K6:()=>w,v9:()=>r,YY:()=>t});var d=c(87550),e=c.n(d),f=c(73024),g=c.n(f),h=c(76760),i=c.n(h);let j=i().join(process.cwd(),"data"),k=i().join(j,"pilotage.sqlite");g().existsSync(j)||g().mkdirSync(j,{recursive:!0});let l=new(e())(k);l.pragma("journal_mode = WAL"),l.exec(`
  CREATE TABLE IF NOT EXISTS imports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    row_count INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS kpi_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    import_id INTEGER NOT NULL,
    scope TEXT NOT NULL,
    kpi_code TEXT NOT NULL,
    period TEXT NOT NULL,
    value REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_id) REFERENCES imports(id) ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_kpi_snapshots_unique
    ON kpi_snapshots(import_id, scope, kpi_code, period);

  CREATE TABLE IF NOT EXISTS kpi_overrides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scope TEXT NOT NULL,
    kpi_code TEXT NOT NULL,
    period TEXT NOT NULL,
    value REAL NOT NULL,
    note TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_kpi_overrides_unique
    ON kpi_overrides(scope, kpi_code, period);
`);var m=c(21419),n=c(38629),o=c(43344);let p=n.Ikc({scope:n.k5n(o.i),kpiCode:n.k5n(o.O),period:n.YjP().min(1),value:n.auy.number()}),q=n.Ikc({scope:n.k5n(o.i),kpiCode:n.k5n(o.O),period:n.YjP().min(1),value:n.auy.number(),note:n.YjP().optional().transform(a=>a||"")});function r(){return l.prepare("SELECT id, filename, imported_at as importedAt, row_count as rowCount FROM imports ORDER BY id DESC").all()}function s(a,b){let c=l.prepare("INSERT INTO imports (filename, row_count) VALUES (?, ?)"),d=l.prepare("INSERT INTO kpi_snapshots (import_id, scope, kpi_code, period, value) VALUES (?, ?, ?, ?, ?)");return l.transaction(b=>{let e=Number(c.run(a,b.length).lastInsertRowid);for(let a of b){let b=p.parse(a);d.run(e,b.scope,b.kpiCode,b.period,b.value)}return e})(b)}function t(a){let b=q.parse(a);l.prepare(`
    INSERT INTO kpi_overrides (scope, kpi_code, period, value, note, updated_at)
    VALUES (@scope, @kpiCode, @period, @value, @note, CURRENT_TIMESTAMP)
    ON CONFLICT(scope, kpi_code, period)
    DO UPDATE SET value = excluded.value, note = excluded.note, updated_at = CURRENT_TIMESTAMP
  `).run(b)}function u(a,b){let c=l.prepare(`
    WITH latest_import AS (
      SELECT id FROM imports ORDER BY id DESC LIMIT 1
    )
    SELECT
      s.scope as scope,
      s.kpi_code as kpiCode,
      s.period as period,
      COALESCE(o.value, s.value) as value,
      CASE WHEN o.id IS NOT NULL THEN 'override' ELSE 'import' END as source,
      s.import_id as importBatchId,
      o.updated_at as overriddenAt,
      o.note as notes
    FROM kpi_snapshots s
    JOIN latest_import li ON li.id = s.import_id
    LEFT JOIN kpi_overrides o
      ON o.scope = s.scope
      AND o.kpi_code = s.kpi_code
      AND o.period = s.period
    WHERE s.scope = ?
    ORDER BY s.period ASC, s.kpi_code ASC
  `).all(a);return b?c.filter(a=>a.period===b):c}function v(){return l.prepare(`
    WITH latest_import AS (
      SELECT id FROM imports ORDER BY id DESC LIMIT 1
    )
    SELECT DISTINCT period
    FROM kpi_snapshots
    WHERE import_id = (SELECT id FROM latest_import)
    ORDER BY period ASC
  `).pluck().all()}function w(){let a=v().sort(m.cA);return{AGENCE:u("AGENCE"),VL:u("VL"),PL:u("PL"),periods:a,imports:r()}}},82704:()=>{},91238:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,65169,23))}};