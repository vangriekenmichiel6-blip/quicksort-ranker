
const CACHE_NAME = "quicksort-rank-v4";

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
  "./lists/soadsongs.txt",
  "./lists/marvelheros.txt"
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
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) return cached;

        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("Offline and resource unavailable", {
          status: 503
        });
      })
  );
});