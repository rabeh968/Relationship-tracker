const CACHE='nabd-v2';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  const store=r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r};
  // ملفات التطبيق: الشبكة أولًا (لتصلك التحديثات) ثم النسخة المحفوظة دون إنترنت. الخطوط: المحفوظ أولًا.
  e.respondWith(same
    ?fetch(e.request).then(store).catch(()=>caches.match(e.request))
    :caches.match(e.request).then(hit=>hit||fetch(e.request).then(store)));
});
