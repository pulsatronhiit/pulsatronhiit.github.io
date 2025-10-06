const CACHE_NAME = 'hiit-workout-v1';

// Determine base path based on environment
const isProduction = self.location.pathname.includes('/hiity/');
const basePath = isProduction ? '/hiity/' : '/';

const urlsToCache = [
  basePath,
  `${basePath}index.html`,
  `${basePath}exercises.json`,
  `${basePath}manifest.json`,
  `${basePath}icon-192x192.svg`,
  `${basePath}icon-512x512.svg`,
  `${basePath}src/main.jsx`,
  `${basePath}src/App.jsx`,
  `${basePath}src/App.css`,
  `${basePath}src/index.css`,
  `${basePath}src/components/Timer.jsx`,
  `${basePath}src/components/ExerciseDisplay.jsx`,
  `${basePath}src/utils/serviceWorker.js`
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All files cached');
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip Vite development tools in offline mode
  if (event.request.url.includes('@vite/client') || 
      event.request.url.includes('@react-refresh') ||
      event.request.url.includes('/@vite/') ||
      event.request.url.includes('/@react-refresh')) {
    return; // Let it fail naturally, don't handle these requests
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache CSS, JS, and other assets dynamically
                if (event.request.url.includes('.css') || 
                    event.request.url.includes('.js') || 
                    event.request.url.includes('hiity/assets/') ||
                    event.request.url.includes('/src/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If network fails and we don't have cache, return offline page
            if (event.request.destination === 'document') {
              return caches.match(`${basePath}index.html`);
            }
            
            // For other failed requests, return undefined to let them fail gracefully
            return new Response('', { status: 408, statusText: 'Request Timeout' });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});