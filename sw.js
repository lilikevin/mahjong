const C='mj-v20-v2.0.24';
const A=[
  './','index.html','app.html','app.js?v=2.0.24','app.css?v=2.0.24',
  'mj-core.js?v=2.0.24','engine.js?v=2.0.24','engine2.js?v=2.0.24',
  'engine4.js?v=2.0.24','engine_hk.js?v=2.0.24','engine_wild.js?v=2.0.24',
  'wild-worker.js?v=2.0.24','manifest.json?v=2.0.24','version.json','sw.js',
  'icon-192.png?v=2.0.24','icon-512.png?v=2.0.24'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mj-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();e.waitUntil(caches.open(C).then(c=>c.put(e.request,cp)));}return r;}).catch(()=>caches.match(e.request).then(r=>r||new Response('Offline file unavailable',{status:503}))));});
