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

function showNotification(messagee) {
  if(Notification.permission==='granted'){
    const options = {
      body: messagee,
      icon: "Assets/main-icon.png",
    };

    self.registration.showNotification('Payment due', options)
  }
}
function getDailyNewsInCache() {
  localforage.getItem("Wallet", function(err, value) {
    if (!err) {
      data = JSON.parse(value)["CREDIT CARDS"]
      for(var keeey in data)
      {
          if(keeey=="TRANSACTIONS"||keeey=="NO_OF_CARDS" ||keeey=="TRXNUM")
          {
              
          }
          else
          {
              currentDate = data[keeey]["DueDate"]
              curre = new Date();
              orrr = new Date(currentDate)
              cccc = new Date(currentDate);
              if (daystogo>0 && daystogo<=5)
              {
                  try
                  {
                      console.log("TRYING")
                      showNotification(`Payment for ${keeey} is due in ${daystogo} day(s). Amount to be paid is ₹${data[keeey]["BalanceOutstanding"]}`)
                  }
                  catch{
                      console.log("FAILED")
                      swal("Payment due", `Payment for ${keeey} is due in ${daystogo} day(s). Amount to be paid is ₹${data[keeey]["BalanceOutstanding"]}`, "info");
                  }
              }
              else if(daystogo==0)
              {
                  try
                  {
                      showNotification(`Last date for Payment of ${keeey} is today. Please pay if you have'nt already. Ignore if already paid. Amount to be paid is ₹${data[keeey]["BalanceOutstanding"]}`)
                  }
                  catch{
                      swal("Payment due", `Last date for Payment of ${keeey} is today. Please pay if you have'nt already. Ignore if already paid. Amount to be paid is ₹${data[keeey]["BalanceOutstanding"]}`, "info");
                  }
              }
          }
      }
      
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
