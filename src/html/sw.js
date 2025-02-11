var cacheName = "v2";
var dynamiccacheName = "v1";
const assets = [
  "/",
  "/index.html",
  "/src/js/index.js",
  "/src/css/index.css",
  "/service.js",
  "/sw.js",
];
self.addEventListener("install", (e) => {
  console.log("service worker has been installed");
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener("active", (e) => {
  console.log("service worker has been actived");
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});
self.addEventListener("fetch", (e) => {
  console.log("service worker has been fetched");
  e.respondWith(
    caches.match(e.request).then((response) => {
      return (
        response ||
        fetch(e.request).then(async (fetchRes) => {
          return caches.open(dynamiccacheName).then((cache) => {
            cache.put(e.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
