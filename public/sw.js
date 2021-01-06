const staticCacheName = 'site-static';
const assets = [
    '/',
    '/stripe.js',
    '/loader.js',
    '/manifest.json',
    '/css/card.css',
    '/css/main.css',
    '/img/gus4.png',
    '/img/flag5.jpg',
    '/img/blackfam-v2.jpg',
    '/img/exchangeClub-small.jpg',
    '/img/GUS3.jpg',
    '/img/flag4.jpg',
    '/img/blueribbon.png',
    '/img/GUS2-cropped.jpg',
    '/img/flag2.jpg',
    '/img/plants.jpg',
    '/img/money.jpg',
    '/img/childcare.jpg',
    '/img/american-flag-373362_1920.jpg',
    '/img/dave-sherrill-unsplash.jpg',
    '/img/success.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
];

// install event
self.addEventListener('install', evt=>{
    evt.waitUntil(
        caches.open(staticCacheName)
        .then(cache =>{
            console.log('caching shell assets');
            return cache.addAll(assets);
        })
        .then(()=>{
            console.log('all files cached');
            return self.skipWaiting();
        })
        .catch(err=>{
            console.log('failed to cache ',err);
        })
    );
    console.log('service worker has been installed');
});

// activate event
self.addEventListener('activate', evt=>{
    console.log('service worker has been activated');
});

// fetch event
self.addEventListener('fetch', evt=>{
    evt.respondWith(
        caches.match(evt.request)
        .then(cacheRes =>{
            return cacheRes || fetch(evt.request);
        })
    );
    // console.log('fetch event', evt);
});
