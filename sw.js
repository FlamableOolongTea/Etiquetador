const CACHE = 'etiquetas-v2';   // ← subí este número en CADA actualización

const ARCHIVOS = [
  '.',
  'index.html',
  'styles.css',
  'app.js',
  'jsbarcode.min.js',
  'manifest.webmanifest',
];

// Instalación: baja una copia fresca de cada archivo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ARCHIVOS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// Activación: borra los cachés de versiones viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(
        nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Cada pedido: responde del caché o, si no está, va a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});