const CACHE_NAME = "quicksort-rank-v2";
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./quicksort.js",  
  "./storage.js",
  "./ui.js",
  "./basics.js",
  "./keepcut.js",
  "./halflist.js",
  "./blindranking.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./lists/animals.txt",
  "./lists/galaxystars.txt",
  "./lists/kulvakken.txt",
  "./lists/mariogalaxies.txt",
  "./lists/marvel.txt",
  "./lists/MCUprojects.txt",
  "./lists/pixar.txt",
  "./lists/platen.txt",
  "./lists/platenencds.txt",
  "./lists/pokemonGen1.txt",
  "./lists/pz1allanimals.txt",
  "./lists/r6att.txt",
  "./lists/r6def.txt",
  "./lists/r6ops.txt",
  "./lists/soadsongs.txt"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // For page navigations, prefer the latest online page but fall back to the
  // cached app when offline. Other local assets use the cache first.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
