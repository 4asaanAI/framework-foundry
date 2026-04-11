// Layaa OS — Service Worker for offline PWA support
const CACHE_NAME = "layaa-cache-v2";
const STATIC_ASSETS = ["/", "/index.html"];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and Supabase API calls
  if (request.method !== "GET") return;
  if (request.url.includes("supabase.co")) return;
  if (request.url.includes("/functions/")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, serve index.html (SPA fallback)
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
