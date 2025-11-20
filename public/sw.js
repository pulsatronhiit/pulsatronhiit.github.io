const CACHE_NAME = 'hiit-app-v1';
const urlsToCache = [
  '/app/',
  '/app/index.html',
  '/app/exercises.json',
  '/app/workout.json',
  '/app/manifest.json',
  '/app/sw.js'
];

// Install event - Cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Service Worker: Cache failed', err))
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Network First, Cache Fallback strategy
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.includes('chrome-extension')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then(response => {
        // Check if response is valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = response.clone();

        // Update cache with new response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        console.log('Service Worker: Network failed, trying cache for', event.request.url);
        return caches.match(event.request)
          .then(response => {
            if (response) {
              console.log('Service Worker: Found in cache', event.request.url);
              return response;
            }
            // If not in cache and it's a navigation request, return index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/app/index.html');
            }
            // For other requests, return a basic offline response
            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Handle background sync for when connection is restored
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Refresh cache when connection is restored
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
      })
    );
  }
});

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  // Handle push notifications here if needed in future
});