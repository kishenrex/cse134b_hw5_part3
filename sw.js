const CACHE_NAME = 'portfolio-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './about.html',
  './projects.html',
  './experience.html',
  './contact.html',
  './resume.html',
  './assets/css/style.css',
  './assets/css/ProjectCard.css',
  './assets/scripts/theme-blocker.js',
  './assets/scripts/theme-toggle.js',
  './assets/scripts/ProjectCard.js',
  './assets/scripts/admin.js',
  './assets/images/favicon.ico',
  './assets/images/profile_pic.jpg',
  './assets/images/profile_pic_50.jpg',
  './assets/images/prof_pic_webp.webp',
  './assets/images/prof_pic_webp_50.webp',
  './assets/images/nightly_sample.png',
  './assets/images/ame_website.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});