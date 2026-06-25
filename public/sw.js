// Club Verdura — Service Worker
// Estrategia: Network First con fallback a caché.
// Cada vez que el usuario abre la app, intenta bajar la versión más nueva.
// Si no hay internet, usa la caché guardada.

const CACHE_NAME = 'club-verdura-v1';

// Al instalar, cachea los archivos principales
self.addEventListener('install', (event) => {
  self.skipWaiting(); // activa inmediatamente sin esperar
});

// Al activar, limpia cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // toma control de todas las pestañas abiertas
});

// Fetch: Network First
self.addEventListener('fetch', (event) => {
  // Solo interceptar requests GET del mismo origen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red respondió bien, guardamos en caché y devolvemos
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Sin internet: intentar servir desde caché
        return caches.match(event.request);
      })
  );
});
