const CACHE = 'etiquetas-v1';

const ARCHIVOS = [
  '.',
  'index.html',
  'styles.css',
  'app.js',
  'jsbarcode.min.js',
  'manifest.webmanifest',
];

// Instalación: guarda una copia de cada archivo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS))
  );
});

// Intercepta cada pedido: responde del caché o, si no está, va a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});