const C='mj-v19-v1.5.1';
const A=['./','index.html','app.js','mj-core.js','engine.js','engine2.js','engine4.js','engine_hk.js','engine_wild.js','wild-worker.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mj-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();e.waitUntil(caches.open(C).then(c=>c.put(e.request,cp)));}return r;}).catch(()=>caches.match(e.request).then(r=>r||new Response('Offline file unavailable',{status:503}))));});
