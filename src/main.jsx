import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DentalProvider } from './context/DentalContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DentalProvider>
      <App />
    </DentalProvider>
  </React.StrictMode>
);

// Keep the service worker out of development so it cannot serve stale Vite modules.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.DEV) {
      const serviceWorkerUrl = new URL('/sw.js', window.location.origin).href;
      navigator.serviceWorker.getRegistrations()
        .then(async (registrations) => {
          await Promise.all(registrations
            .filter((registration) => [
              registration.active,
              registration.waiting,
              registration.installing,
            ].some((worker) => worker?.scriptURL === serviceWorkerUrl))
            .map((registration) => registration.unregister()));

          const cacheNames = await caches.keys();
          await Promise.all(cacheNames
            .filter((name) => name.startsWith('oral-health-clinical-'))
            .map((name) => caches.delete(name)));
        })
        .catch((error) => {
          console.error('Could not clear the development service worker cache.', error);
        });
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Could not register the service worker.', error);
    });
  });
}
