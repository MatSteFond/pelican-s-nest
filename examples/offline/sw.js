// Service worker: lets the app open without a connection (useful in places
// with poor signal). It always tries the network first, so people get your
// newest version whenever they're online, and falls back to the saved copy.
const CACHE = 'app-v1';
// Every page and file the app needs to open without a connection. Add your own here.
const SAVE_FOR_OFFLINE = ['/', '/styles.css', '/offline.js', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SAVE_FOR_OFFLINE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Only handle this app's own pages and files. Live data is never cached.
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  if (/^\/(api|live|staff|healthz)(\/|$)/.test(url.pathname)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const saved = await caches.match(request);
        if (saved) return saved;
        if (request.mode === 'navigate') return caches.match('/offline.html');
        return Response.error();
      })
  );
});
