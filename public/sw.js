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

// Troque a versão sempre que mudar a estratégia de cache: os aparelhos
// instalam o SW novo e o "activate" apaga os caches antigos.
const CACHE = "apexfit-v4";
const OFFLINE_PAGE = "/offline";
const PUBLIC_ASSETS = ["/manifest.json", "/icon.svg", "/icon-192.png", "/icon-512.png"];
// Páginas autenticadas nunca são cacheadas; a lista só limpa sobras de versões antigas.
const PRIVATE_PATHS = ["/", "/login"];
const STATIC_ASSET = /\/_next\/static\/[^"'\s<>\\)]+/g;

/**
 * Guarda a página /offline e todos os JS/CSS que ela usa. Sem isso, num app
 * recém-instalado os chunks ainda não estariam no cache e a página abriria
 * quebrada sem internet.
 */
async function precacheOfflineShell() {
  const cache = await caches.open(CACHE);
  const response = await fetch(OFFLINE_PAGE, { cache: "reload", credentials: "omit" });
  if (!response.ok) throw new Error(`Falha ao baixar ${OFFLINE_PAGE}: ${response.status}`);

  const html = await response.text();
  // Recria a resposta para nunca guardar uma resposta "redirecionada": o Safari
  // e o Chrome recusam servi-las para navegações e mostram o erro de rede nativo.
  await cache.put(
    OFFLINE_PAGE,
    new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } })
  );

  const assets = [...new Set(html.match(STATIC_ASSET) ?? [])];
  await Promise.all(
    [...assets, ...PUBLIC_ASSETS].map((url) =>
      cache.add(url).catch(() => {
        // Um asset que falhe não deve impedir a instalação do SW.
      })
    )
  );
}

async function offlineFallback(request) {
  const pathname = new URL(request.url).pathname;
  const cached = await caches.match(OFFLINE_PAGE);

  if (cached && pathname === OFFLINE_PAGE) return cached;
  if (cached) return Response.redirect(new URL(OFFLINE_PAGE, self.location.origin).toString(), 302);

  return new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ApexFit</title><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center"><div><h1 style="font-size:20px">Sem internet</h1><p>Conecte-se e toque para tentar de novo.</p><button onclick="location.reload()" style="min-height:44px;padding:0 20px;font-size:16px">Tentar de novo</button></div></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheOfflineShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CLEAR_PRIVATE_CACHE") {
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        cache.keys().then((keys) =>
          Promise.all(
            keys
              .filter((req) => PRIVATE_PATHS.includes(new URL(req.url).pathname))
              .map((req) => cache.delete(req))
          )
        )
      )
    );
  }
});

self.addEventListener("fetch", (event) => {
  // Ignora requests que não sejam GET e requisições de API/auth: dados privados
  // devem sempre ser validados pelo servidor quando houver conexão.
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith("/api/")) return;

  const isStaticAsset =
    requestUrl.pathname.startsWith("/_next/static/") ||
    requestUrl.pathname.startsWith("/icon") ||
    requestUrl.pathname === "/manifest.json";
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ??
          fetch(event.request).then((response) => {
            if (response.ok && !response.redirected) {
              const copy = response.clone();
              void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Navegação: sempre rede primeiro (nunca cacheia HTML privado). Sem rede,
  // cai na página /offline, que lê o treino salvo no IndexedDB.
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => offlineFallback(event.request)));
});
