// Build-time cache version - gets replaced during build process
const CACHE_VERSION = typeof __CACHE_VERSION__ !== 'undefined' ? __CACHE_VERSION__ : Date.now().toString();
const CACHE_NAME = `hiit-workout-v${CACHE_VERSION}`;

// Determine base path based on environment
const isProduction = self.location.pathname.includes('/hiity/');
const basePath = isProduction ? '/hiity/' : '/';

const urlsToCache = [
  basePath,
  `${basePath}index.html`,
  `${basePath}exercises_new.json`,
  `${basePath}workout.json`,
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

// Install event - cache resources but don't activate immediately during usage
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing version', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files for version:', CACHE_VERSION);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Files cached, waiting for activation on next app start');
        // Don't skip waiting - let it activate naturally on next page load
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

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating new version:', CACHE_VERSION);
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker: New version activated');
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ 
            type: 'CACHE_UPDATED', 
            version: CACHE_VERSION 
          });
        });
      });
    })
  );
});