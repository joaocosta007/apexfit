// Service Worker — ApexFit PWA
// Estratégia: network-first (o app precisa de internet para o banco de dados)

const CACHE = "apexfit-v1";
const OFFLINE_URLS = ["/", "/login"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Ignora requests que não sejam GET e requisições de API/auth
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => response ?? caches.match("/"))
  );
});
