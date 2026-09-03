// Service Worker — ApexFit PWA
// O plano do aluno fica no IndexedDB; este cache mantém a casca offline disponível.

// ── Push Notifications ────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? "ApexFit";
  const options = {
    body:    data.body  ?? "",
    icon:    "/icon-192.png",
    badge:   "/icon-192.png",
    vibrate: [200, 100, 200],
    data:    { url: data.url ?? "/" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// ── Cache / install ───────────────────────────────────────────────────────

const CACHE = "apexfit-v2";
const OFFLINE_URLS = ["/offline", "/", "/login", "/manifest.json", "/icon.svg"];

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
  // Ignora requests que não sejam GET e requisições de API/auth: dados privados
  // devem sempre ser validados pelo servidor quando houver conexão.
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith("/api/")) return;

  const isStaticAsset = requestUrl.pathname.startsWith("/_next/static/") || requestUrl.pathname.startsWith("/icon") || requestUrl.pathname === "/manifest.json";
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached ?? fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }))
    );
    return;
  }

  const isNavigation = event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html");
  if (!isNavigation) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => response ?? Response.redirect(new URL("/offline", self.location.origin).toString(), 302))
  );
});
