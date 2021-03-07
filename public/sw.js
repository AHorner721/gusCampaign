const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
    '/',
    '/fallback.html',
    '/stripe.js',
    '/loader.js',
    '/manifest.json',
    '/css/card.css',
    '/css/main.css',
    '/img/gus4.jpg',
    '/img/flag5.jpg',
    '/img/blackfam-v2.jpg',
    '/img/exchangeClub-small.jpg',
    '/img/GUS3.jpg',
    '/img/GUS3-1.jpg',
    '/img/flag4.jpg',
    '/img/blueribbon.jpg',
    '/img/GUS2-cropped.jpg',
    '/img/flag2.jpg',
    '/img/plants.jpg',
    '/img/money.jpg',
    '/img/childcare.jpg',
    '/img/american-flag-373362_1920.jpg',
    '/img/dave-sherrill-unsplash.jpg',
    '/img/success.png',
    '/img/flag6-op2.jpg',
    '/img/bestLanding.jpg',
    '/img/army-corp-eng.jpg',
    '/img/award-ceremony.jpg',
    '/img/district-ceremony.jpg',
    '/img/girlswhocode.jpg',
    '/img/governor-meeting.jpg',
    '/img/meeting.jpg',
    '/img/monument.jpg',
    '/img/olyminpic-meeting.jpg',
    '/img/work-test.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://js.stripe.com/v3/',
    'https://code.jquery.com/jquery-3.5.1.min.js',
    'https://platform.twitter.com/widgets.js'
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
    evt.waitUntil(
        caches.keys().then(keys =>{
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
    console.log('service worker has been activated');
});

// fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          })
        });
      }).catch(() => caches.match('/fallback.html'))
    );
});
