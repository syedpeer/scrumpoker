var cacheName = 'scrumpoker:0001';
var cacheFiles = [
    '/scrumpoker/',
    '/scrumpoker/index.html',
    '/scrumpoker/css/main.css',
    '/scrumpoker/css/components/poker.css',
    '/scrumpoker/js/poker.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                //console.log('Opened cache');
                return cache.addAll(cacheFiles);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Grab the asset from SW cache.
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }).catch(function() {
            // Can't access the network return an offline page from the cache
            return caches.match('offline.html');
        })
    );
});

// Empty out any caches that don’t match the ones listed.
self.addEventListener('activate', function(event) {

    var cacheWhitelist = ['scrumpoker:0001'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
