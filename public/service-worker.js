self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, vibrate, tag } = event.data.options || {};
    self.registration.showNotification(title || 'Pokédex actualizada', {
      body: body || 'Atrápalos ya',
      icon: icon || '/icons/icon-192x192.png',
      vibrate: vibrate || [200, 100, 200],
      tag: tag || 'poke-notify',
    });
  }
});
