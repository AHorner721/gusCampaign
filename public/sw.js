const version = 72;

const staticCacheName = `site-static-v${version}`;
const dynamicCacheName = `site-dynamic-v${version}`;
const assets = [
  "/",
  "/fallback.html",
  "/checkout.js",
  "/loader.js",
  "/amt.js",
  "/manifest.json",
  "/css/card.css",
  "/css/main.css",
  "/img/gus4.jpg",
  "/img/gusblackmarine.jpg",
  "/img/flag5.jpg",
  "/img/blackfam-v2.jpg",
  "/img/exchangeClub-small.jpg",
  "/img/sidebyside.jpg",
  "/img/GUS3.jpg",
  "/img/GusBlackYardSign.webp",
  "/img/GUS3-1.jpg",
  "/img/flag4.jpg",
  "/img/blueribbon.jpg",
  "/img/GUS2-cropped.jpg",
  "/img/plants.webp",
  "/img/money.webp",
  "/img/childcare.webp",
  "/img/american-flag-373362_1920.jpg",
  "/img/dave-sherrill-unsplash.jpg",
  "/img/success.png",
  "/img/flag6-op2.jpg",
  "/img/bestLanding.jpg",
  "/img/landing2023.png",
  "/img/mayor_landing2023.webp",
  "/img/alderman_gus1.webp",
  "/img/gusForMayor.webp",
  "/img/gusandrandall_small.webp",
  "/img/GusAtRetirementCeremony.webp",
  "/img/GusAtScienceFair.webp",
  "/img/GusAtSouthernUniversityTop.webp",
  "/img/GusByTank.webp",
  "/img/gusandtankresize.webp",
  "/img/GusWithATV.webp",
  "/img/GusWithMilitaryVechile.webp",
  "/img/kyle-carpenter-and-gus-black.webp",
  "/img/waterdrive.webp",
  "/img/police.webp",
  "/img/seniorcenter.webp",
  "/img/gusUSMC2023.webp",
  "/img/royretirementceremonyresized.webp",
  "/img/toydrive.webp",
  "/img/Richland-Rec-Center-2023-10-02-Source-Jaala-Jones.webp",
  "/img/army-corp-eng.jpg",
  "/img/award-ceremony.jpg",
  "/img/district-ceremony.jpg",
  "/img/girlswhocode.jpg",
  "/img/governor-meeting.jpg",
  "/img/meeting.jpg",
  "/img/monument.jpg",
  "/img/olyminpic-meeting.jpg",
  "/img/work-test.jpg",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://js.stripe.com/v3/",
  "https://code.jquery.com/jquery-3.5.1.min.js",
];

// install event
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then((cache) => {
        console.log("caching shell assets");
        return cache.addAll(assets);
      })
      .then(() => {
        console.log("all files cached");
        return self.skipWaiting();
      })
      .catch((err) => {
        console.log("failed to cache ", err);
      })
  );
  console.log("service worker has been installed");
});

// activate event
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
  console.log("service worker has been activated");
});

// fetch event
self.addEventListener("fetch", (evt) => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
      .catch(() => caches.match("/fallback.html"))
  );
});
