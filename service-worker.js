// Service Worker for ADHS Jetzt-Planer
const CACHE_NAME = 'adhs-planer-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'uplifting-intro-music-for-youtube-and-podcasts-by-joshua-wales-292600.mp3'
];

// Install event - cache basic files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName !== CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache if possible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Don't cache responses with errors
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  if (event && event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'ADHS Planer Benachrichtigung',
      icon: data.icon || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM2QjhFMjMiIHJ4PSIxMCIgcnk9IjEwIi8+PHRleHQgeD0iNTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5ONPC90ZXh0Pjwvc3ZnPg==',
      vibrate: [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ADHS Planer', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        if (clientList.length > 0) {
          // If app is already open, focus it
          return clientList[0].focus();
        }
        // Otherwise open a new window
        return clients.openWindow('/');
      })
  );
});
