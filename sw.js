// Offline cache: saves every game file on the first visit, then serves from the phone and refreshes quietly when online.
const CACHE = 'lockdown-inn-v1';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './lib/three.module.js',
  './lib/addons/loaders/GLTFLoader.js',
  './lib/addons/utils/BufferGeometryUtils.js',
  './assets/hotel_room.glb',
  './assets/person_courier.glb',
  './assets/person_gamer.glb',
  './assets/person_neighbor.glb',
  './assets/person_puffer.glb',
  './assets/person_worker.glb',
  './assets/voices/catlady.mp3',
  './assets/voices/clerk.mp3',
  './assets/voices/courier.mp3',
  './assets/voices/exterminator.mp3',
  './assets/voices/gamer.mp3',
  './assets/voices/neighbor.mp3',
  './assets/voices/puffer.mp3',
  './assets/voices/traveler.mp3',
  './assets/voices/worker.mp3',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      const fresh = fetch(e.request).then((res) => {
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
