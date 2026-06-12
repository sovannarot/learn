const CACHE_VERSION = "v4";
const STATIC_CACHE = `learn-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `learn-runtime-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/daily.html",
  "/manifest.json",
  "/service.js",
  "/sw.js",
  "/src/css/index.css",
  "/src/js/index.js",
  "/src/css/about.css",
  "/src/js/about.js",
  "/src/css/clock.css",
  "/src/js/clock.js",
  "/src/css/post.css",
  "/src/js/post.js",
  "/src/html/about.html",
  "/src/html/clock.html",
  "/src/html/post.html",
  "/src/html/math.html",
  "/src/html/math1.html",
  "/src/html/math2.html",
  "/src/html/math3.html",
  "/src/html/math4.html",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.error("SW install failed", err)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isNavigation = event.request.mode === "navigate";
  const isStaticAsset = STATIC_ASSETS.some(
    (asset) => requestUrl.pathname === asset,
  );

  if (isNavigation) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (
    isStaticAsset ||
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "image" ||
    event.request.destination === "font"
  ) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetchAndCache(event.request);
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetchAndCache(request);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

async function fetchAndCache(request) {
  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone());
  return response;
}
