/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Chat Request';
  const options = {
    body: data.body || 'A client wants to chat with you.',
    icon: '/logo.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // ✅ open chat page when notification is clicked
  event.waitUntil(clients.openWindow('/'));
});
