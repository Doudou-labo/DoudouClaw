(()=>{var a={};a.id=485,a.ids=[485],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},21419:(a,b,c)=>{"use strict";c.d(b,{OM:()=>g,PS:()=>i,cA:()=>j,dH:()=>h,fQ:()=>f});let d=["JANVIER","FEVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOUT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DECEMBRE"],e={"01":"Janvier","02":"F\xe9vrier","03":"Mars","04":"Avril","05":"Mai","06":"Juin","07":"Juillet","08":"Ao\xfbt","09":"Septembre",10:"Octobre",11:"Novembre",12:"D\xe9cembre"};function f(a){return String(a??"").normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/\s+/g," ").trim().toUpperCase()}function g(a){let b=f(a),c=d.findIndex(a=>b===a);return c>=0?String(c+1).padStart(2,"0"):null}function h(a,b){return`${a}-${b}`}function i(a){let b=a.match(/^(\d{4})-(\d{2})$/);if(!b)return a;let[,c,d]=b;return`${e[d]||d} ${c}`}function j(a,b){return a.localeCompare(b)}},22500:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{POST:()=>w});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(79309);async function w(a){try{let b=await a.json();return(0,v.YY)(b),u.NextResponse.json({ok:!0})}catch(a){return u.NextResponse.json({error:a instanceof Error?a.message:"Override KO"},{status:400})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/overrides/route",pathname:"/api/overrides",filename:"route",bundlePath:"app/api/overrides/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/root/.openclaw/workspace/projects/pilotage-dashboard/app/api/overrides/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/overrides/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},43344:(a,b,c)=>{"use strict";c.d(b,{O:()=>e,i:()=>d});let d=["AGENCE","VL","PL"],e=["CA","PS","MARGE","OBJECTIF_EVOLUTION","OBJECTIF_N","OBJECTIF_JOURNALIER","RESTE_A_FAIRE","ATTERRISSAGE_FDM","COMPARAISON_N_1"]},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:a=>{"use strict";a.exports=require("node:fs")},76760:a=>{"use strict";a.exports=require("node:path")},78335:()=>{},79309:(a,b,c)=>{"use strict";c.d(b,{aw:()=>s,iE:()=>v,M5:()=>u,K6:()=>w,v9:()=>r,YY:()=>t});var d=c(87550),e=c.n(d),f=c(73024),g=c.n(f),h=c(76760),i=c.n(h);let j=i().join(process.cwd(),"data"),k=i().join(j,"pilotage.sqlite");g().existsSync(j)||g().mkdirSync(j,{recursive:!0});let l=new(e())(k);l.pragma("journal_mode = WAL"),l.exec(`
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
  `).pluck().all()}function w(){let a=v().sort(m.cA);return{AGENCE:u("AGENCE"),VL:u("VL"),PL:u("PL"),periods:a,imports:r()}}},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},87550:a=>{"use strict";a.exports=require("better-sqlite3")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[331,629,692],()=>b(b.s=22500));module.exports=c})();