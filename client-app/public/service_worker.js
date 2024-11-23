const CACHE_NAME = 'currence-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html'
];

// Installazione del Service Worker: cache delle risorse statiche
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Attivazione del Service Worker: pulizia vecchi cache
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

// Intercettazione delle richieste e risposta da cache o rete
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return cachedResponse;
            }
            // console.log('[Service Worker] Fetching from network:', event.request.url);
            return fetch(event.request);
        })
    );
});
