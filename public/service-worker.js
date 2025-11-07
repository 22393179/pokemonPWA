// service-worker.js
self.addEventListener('install', () => {
  console.log('Service Worker instalado.');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activado.');
});

// No hace falta escuchar mensajes si usamos showNotification()
