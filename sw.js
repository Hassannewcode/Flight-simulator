const CACHE_NAME = 'geoFS-cache-v1';
const FILES_TO_CACHE = [
  // GeoFS data files
  './data/runwaygrid.js',
  './data/airports.js',

  // Cesium core and workers
  './js/Cesium/build/Cesium.js',
  './js/Cesium/build/Workers/when-229515d6.js',
  './js/Cesium/build/Workers/WebGLConstants-f63312fc.js',
  './js/Cesium/build/Workers/cesiumWorkerBootstrapper.js',
  './js/Cesium/build/Workers/Plane-a66da2a9.js',
  './js/Cesium/build/Workers/TerrainEncoding-0e636976.js',

  // GeoFS main scripts
  './js/commonJS.js',
  './js/geofs.js',
  './js/loader.js',

  // Models & textures
  './models/aircraft/premium/su35/texture-low_1.jpg'
];

// Install event: cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell and assets');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event: cleanup old caches if needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event: serve cached files first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
