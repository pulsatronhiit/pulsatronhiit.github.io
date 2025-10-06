// Service Worker registration utility
export const registerServiceWorker = () => {
  // Only register Service Worker in production
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swPath = '/hiity/sw.js';
      
      navigator.serviceWorker.register(swPath)
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          console.log('Service Worker path:', swPath);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
          console.log('Attempted path:', swPath);
        });
    });
  } else if (import.meta.env.DEV) {
    console.log('Service Worker disabled in development mode');
  } else {
    console.log('Service Worker not supported');
  }
};

export default registerServiceWorker;