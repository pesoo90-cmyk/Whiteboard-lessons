const V='lesson-maker-v7';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url),same=u.origin===location.origin;
 if(same){
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
  return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
  if(res&&(res.ok||res.type==='opaque')&&/fonts\.(googleapis|gstatic)\.com/.test(u.host)){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
  return res}).catch(()=>hit)))});
