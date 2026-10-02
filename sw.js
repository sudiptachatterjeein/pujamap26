/* Puja Map 2026 service worker: app shell works offline; live APIs are never cached. Bump VERSION on each release. */
const VERSION = 'puja26-v1';
const SHELL = ['/', '/index.html', '/assets/app.css?v=1', '/assets/data.js?v=1', '/assets/config.js?v=1', '/assets/i18n.js?v=1', '/assets/core.js?v=1', '/assets/weather.js?v=1',
  '/assets/community.js?v=1', '/assets/map.js?v=1', '/assets/views-home.js?v=1', '/assets/views-explore.js?v=1', '/assets/views-route.js?v=1', '/assets/views-more.js?v=1', '/assets/main.js?v=1',
  '/assets/favicon.svg', '/manifest.webmanifest'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k.startsWith('puja26-')).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // Never cache live data: weather, Supabase, our API.
  if (url.hostname.endsWith('open-meteo.com') || url.hostname.endsWith('supabase.co') || url.pathname.startsWith('/api/')) return;
  // Fonts: cache-first.
  if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => { c.put(req, r.clone()); return r; }).catch(() => hit))));
    return;
  }
  if (url.origin !== location.origin) return;
  // Same-origin: stale-while-revalidate; navigations fall back to the cached shell when offline.
  e.respondWith(caches.open(VERSION).then((c) => c.match(req).then((hit) => {
    const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit || (req.mode === 'navigate' ? c.match('/index.html') : undefined));
    return hit || net;
  })));
});
