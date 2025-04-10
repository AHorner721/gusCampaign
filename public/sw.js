const version = 124;

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
  "/img/qrcode_www.aldermangusblack.com.png",
  "/img/gusHwyCleanup2025.jpg",
  "/img/gusSleepingBag2025.avif",
  "/img/gusSleepingBag1.avif",
  "/img/gus-flag-2025.avif",
  "/img/gus-suit-2025.avif",
  "/img/easter.avif",
  "/img/sign.avif",
  "/img/gus10.avif",
  "/img/cityclean.avif",
  "/img/2kwalk.jpg",
  "/img/easterfling.jpg",
  "/img/pancakes.jpg",
  "/img/voterRegistration.png",
  "/img/meetthecandidates.avif",
  "/img/gus-2025-1.jpg",
  "/img/gus-2025-2.jpg",
  "/img/gus-2025-3.jpg",
  "/img/gus-2025-4.webp",
  "/img/gus-2025-5.webp",
  "/img/gus-2025-6.jpg",
  "/img/gus-2025-7.jpg",
  "/img/gus-2025-9.jpg",
  "/img/gus-2025-12.jpg",
  "/img/gus-2025-13.jpg",
  "/img/gus-2025-14.jpg",
  "/img/gus-2025-15.jpg",
  "/img/gus4.jpg",
  "/img/flag5.jpg",
  "/img/exchangeClub-small.jpg",
  "/img/GUS3.jpg",
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
  "/img/waterdrive.webp",
  "/img/police.webp",
  "/img/seniorcenter.webp",
  "/img/meetcandidates.jpg",
  "/img/gus.png",
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
  evt.respondWith(networkFirst(evt.request));
});
// self.addEventListener("fetch", (evt) => {
//   //console.log('fetch event', evt);
//   evt.respondWith(
//     caches
//       .match(evt.request)
//       .then((cacheRes) => {
//         return (
//           cacheRes ||
//           fetch(evt.request).then((fetchRes) => {
//             return caches.open(dynamicCacheName).then((cache) => {
//               cache.put(evt.request.url, fetchRes.clone());
//               return fetchRes;
//             });
//           })
//         );
//       })
//       .catch(() => caches.match("/fallback.html"))
//   );
// });

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(staticCacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}