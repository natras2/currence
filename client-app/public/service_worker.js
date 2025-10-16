// Genera una versione univoca basata sulla build
const APP_VERSION = '__BUILD_VERSION__'; // Verrà sostituito durante la build
const CACHE_NAME = `currence-cache-${APP_VERSION}`;
const STATIC_ASSETS = [
    "/"
];

// Installazione del Service Worker: cache delle risorse statiche
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install - Version:', APP_VERSION);
    // Forza l'attivazione immediata del nuovo service worker
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Attivazione del Service Worker: pulizia vecchie cache
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate - Version:', APP_VERSION);
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key.startsWith('currence-cache-')) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            // Prende il controllo immediato di tutte le pagine aperte
            return self.clients.claim();
        })
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
            return fetch(event.request);
        })
    );
});

// Messaggi per controllare gli aggiornamenti
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});