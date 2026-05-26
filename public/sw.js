// Service Worker — La Délicieuse Diète — Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'La Délicieuse Diète', body: event.data.text(), url: '/' }; }

  const options = {
    body:    data.body    ?? '',
    icon:    '/favicon.ico',
    badge:   '/favicon.ico',
    vibrate: [200, 100, 200],
    data:    { url: data.url ?? '/' },
  };
  event.waitUntil(self.registration.showNotification(data.title ?? 'La Délicieuse Diète', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(url));
});
