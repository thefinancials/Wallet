const CACHE = "wallet-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Cached offline page during install");
      return cache.add(offlineFallbackPage);
    })
  );
});

self.addEventListener('periodicsync', event => {
  if (event.tag === 'creditcard-duedatechecker') {
      event.waitUntil(getDailyNewsInCache());
  }
});

function getDailyNewsInCache()
{
  const openRequest = indexedDB.open("WalletDatabase", 1);

  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction("cards", "readonly");
    const cardStore = transaction.objectStore("cards");

    // Assuming you have an index named "dueDateIndex"
    const dueDateIndex = cardStore.index("dueDate");
    const datedd = new Date()
    datedd.setHours(0,0,0)
      datedd.toString()
    const request = dueDateIndex.openCursor(IDBKeyRange.only("Fri Aug 25 2023 00:00:00 GMT+0530 (India Standard Time)"	));

    request.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        const cardData = cursor.value;
        // Handle cardData, which contains the card details
        console.log(cardData); // Modify this to handle the data as needed
        cursor.continue();
      }
    };
  };


}


self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("add page to offline cache: " + response.url);

        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {
        console.log("Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        // The following validates that the request was for a navigation to a new document
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