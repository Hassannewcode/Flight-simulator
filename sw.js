const CACHE_NAME = 'geoFS-cache-v1';
const FILES_TO_CACHE = [
  './data/runwaygrid.js',
  './data/airports.js',

  './js/Cesium/build/Cesium.js',
  './js/Cesium/build/Workers/when-229515d6.js',
  './js/Cesium/build/Workers/WebGLConstants-f63312fc.js',
  './js/Cesium/build/Workers/cesiumWorkerBootstrapper.js',
  './js/Cesium/build/Workers/Plane-a66da2a9.js',
  './js/Cesium/build/Workers/TerrainEncoding-0e636976.js',

  './js/commonJS.js',
  './js/geofs.js',
  './js/loader.js',

  './models/aircraft/premium/su35/texture-low_1.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
