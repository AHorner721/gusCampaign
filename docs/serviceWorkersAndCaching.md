# Service Workers & Caching

## Service Worker

<hr>
A service worker is a javascript file that stays registered in browser to allow offline operations.

Browser > Service Worker > Remote Server (Node)

Make use of **promises** (i.e. `.then()` & `.catch()`)

### Use Cases

- Caching assets and api calls
- push notifications
- background data sync and preload

### Life cycle of Events

1. Register
2. Install
3. Activate

Note: Supported in most browsers (safari, edge, chrome, firefox)

### Checking Service Worker Status

<hr>
Open browser dev tools panel and navigate to the **Application** tab. The select _service workers_ from the Application sidebar.

From here, we can see status (i.e. activated & running). There is a "update on reload" checkbox that should be checked for development mode.

## Caching

<hr>
Versions of static and dynamic assets are stored under **Cached Storage** in _Application sidebar_.

Need to track version of cache name.
Store assets in an array - contains pages, styles, and scripts.

### Install Event

<hr>
Handle caching in the service worker's install event.

- `event.waitUntil()` tells browser to wait until the promise finishes to get rid of service worker
- `caches.open()` is from the Cache Storage API.
  - returns a promise so use `.then(cache.addAll(assetsArray));`

Can check the cached assets in browser by using drop down from "Cache Storage" - select latest version, then view asset list in main window.

### Activate Event

<hr>
Cleans up any old/unwanted caches.
Change cache name to a new version then:

- `caches.keys()` loop through cache names and have a condition that checks if the current cache version isn't the same as the updated cache name, then delete the cache with `caches.delete(cache)`.

### Fetch Event

<hr>
Show cached files even when offline.

- Check if live site is available else load the cached site.
  - `event.respondWith(fetch(event.request))` - if promise fails to respond, it will fall back to `.catch()`
  - `caches.match(event.request)` - load files from cache that matches event request.
