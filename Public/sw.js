const V = "pregame-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(["/", "/manifest.webmanifest", "/icons/icon-192.png"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (r.mode === "navigate") { // network first, cached shell when offline
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put("/", cp)); return res; }).catch(() => caches.match("/")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  })));
});
