const STATIC = "staticv1";
const STATIC_LIMIT = 15;
const INMUTABLE = "inmutablev1";
const DYNAMIC = "dynamicv1";
const DYNAMIC_LIMIT = 30;
//todos los recursos propios de la aplicacion
const APP_SHELL = [
  "/",
  "/index.html",
  "css/styles.css",
  "img/delta.jpg",
  "js/app.js",
];
//TODOS AQUELLOS RECURSOS QUE NO VAN A CAMBIAR
const APP_SHELL_INMUTABLE = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];

self.addEventListener("install", (event) => {
  //event.skipWaiting();
  const staticCache = caches.open(STATIC).then((cache) => {
    cache.addAll(APP_SHELL);
  });
  const inmutableCache = caches.open(INMUTABLE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });
  event.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener("activate", (event) => {
  console.log("activado");
});

self.addEventListener("fetch", (event) => {
  // 1. cache only
  // event.respondWith(caches.match(event.request));
  //2. cache with network fallback
  const source = caches.match(event.request).then((response) => {
    if (response) return response;
    return fetch(event.request).then((newResponse) => {
      caches.open(DYNAMIC).then((cache) => {
        cache.put(event.request, newResponse);
      });
      return newResponse.clone();
    });
  });
  event.respondWith(source);
});

self.addEventListener("push", (event) => {
  console.log("PUSH NOTIFICATION");
});

self.addEventListener("sync", (event) => {
  console.log("SYNC EVENT");
});
