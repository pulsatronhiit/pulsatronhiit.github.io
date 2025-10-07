// Service Worker registration utility with aggressive updates
export const registerServiceWorker = () => {
  // Only register Service Worker in production
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Add build timestamp to force SW update check
      const swPath = `/hiity/sw.js?v=${Date.now()}`;
      
      navigator.serviceWorker.register(swPath, {
        updateViaCache: 'none' // Never cache the service worker itself
      })
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Force immediate update check
          registration.update();
          
          // Listen for updates and activate immediately
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker: New version found, installing...');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Service Worker: New version ready, will activate on next app start');
                // Don't force immediate reload - let it activate naturally
              }
            });
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
      
      // Listen for messages from Service Worker (silent logging only)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Service Worker: Cache updated to version:', event.data.version);
          // Just log, don't interrupt user during workout
        }
      });
    });
  } else if (import.meta.env.DEV) {
    console.log('Service Worker disabled in development mode');
  } else {
    console.log('Service Worker not supported');
  }
};

export default registerServiceWorker;