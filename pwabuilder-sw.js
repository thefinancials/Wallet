importScripts("localforage.js");
const CACHE = "wallet-page";
const offlineFallbackPage = "index.html";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.add(offlineFallbackPage);
    })
  );
});

self.addEventListener('periodicsync', event => {
  if (event.tag === 'creditcard-duedatechecker') {
      event.waitUntil(getDailyNewsInCache());
  }
});

function getDailyNewsInCache() {
  localforage.getItem("CREDIT CARDS", function(err, value) {
    if (!err) {
      console.log("Retrieved data from LocalForage:", value);
    } else {
      console.error("Error retrieving data from LocalForage:", err);
    }
  });
}

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function (error) {
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        if (request.destination !== "document" || request.mode !== "navigate") {
          return Promise.reject("no-match");
        }
        return cache.match(offlineFallbackPage);
      }
      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
