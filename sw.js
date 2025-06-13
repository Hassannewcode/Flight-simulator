const CACHE_NAME = 'geoFS-cache-v1';
const FILES_TO_CACHE = [
  'https://www.geo-fs.com/data/runwaygrid.js?k=1',
  'https://www.geo-fs.com/data/airports.js',
  'https://www.gstatic.com/_/mss/boq-identity/_/js/k=boq-identity.IdpIFrameHttp.en_US.tnv-Rq_TBnA.es5.O/am=AIAB/d=1/rs=AOaEmlHw15JmA15i786Jg2aXnjbWaMlreg/m=base',
  'https://www.geo-fs.com/js/Cesium/build/Workers/when-229515d6.js',
  'https://www.geo-fs.com/js/Cesium/build/Workers/WebGLConstants-f63312fc.js',
  'https://www.geo-fs.com/js/Cesium/build/Workers/cesiumWorkerBootstrapper.js',
  'https://www.geo-fs.com/js/Cesium/build/Workers/Plane-a66da2a9.js',
  'https://www.geo-fs.com/js/Cesium/build/Workers/TerrainEncoding-0e636976.js',
  'https://www.geo-fs.com/geofs.php?v=3.9',
  'https://www.geo-fs.com/models/aircraft/premium/su35/texture-low_1.jpg',
  'https://www.geo-fs.com/js/commonJS.js?kc=17',
  'https://www.geo-fs.com/js/geofs.js?kc=394',
  'https://www.geo-fs.com/js/loader.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => cachedResp || fetch(event.request))
  );
});
