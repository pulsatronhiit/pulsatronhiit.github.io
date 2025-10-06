// Service Worker registration utility
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Simple path handling - /sw.js in dev, /hiity/sw.js in production
      const isDev = import.meta.env.DEV;
      const swPath = isDev ? '/sw.js' : '/hiity/sw.js';
      
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
  } else {
    console.log('Service Worker not supported');
  }
};

export default registerServiceWorker;