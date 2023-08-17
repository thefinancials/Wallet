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

function isStatementGeneratedForMonth(transactions, month, year) {
  for (const transaction of transactions) {
    if (
      transaction.Particulars === "Statement generated" &&
      transaction.Date.startsWith(`${year}-${month}`)
    ) {
      return true;
    }
  }
  return false;
}



self.addEventListener('sync', function(event) {
  if (event.type === 'periodic') {
    // Fetch data from localstorage.
    const data = JSON.parse(localStorage.getItem('CREDIT CARDS'));

    for(var keeey in data)
{
    if(keeey=="TRANSACTIONS"||keeey=="NO_OF_CARDS")
    {
        
    }
    else
    {
        currentDate = data[keeey]["DueDate"]
        curre = new Date();
        orrr = new Date(currentDate)
        cccc = new Date(currentDate);
        if(curre>=cccc)
        {
            cccc.setMonth(cccc.getMonth()+1)
            if(cccc.getMonth()==0)
            {
                cccc.setFullYear(cccc.getFullYear()+1)
            }

            trrr = data["TRANSACTIONS"]           
            let statementGenerated = isStatementGeneratedForMonth(trrr, new Date().getMonth()+1, new Date().getFullYear())
            if(statementGenerated==false)
            {
                new_object = new Object()
                tobewritten = `${orrr.getFullYear()}-${orrr.getMonth()+1}-${orrr.getDate()}`
                new_object.Date = tobewritten
                new_object.Particulars = "Statement generated"
                new_object.CreditCard = keeey
                new_object.Amount = data[keeey]["BalanceOutstanding"]
                new_object.Type=""
                new_object.Narration=""
                data["TRANSACTIONS"].push(new_object)
                data[keeey]["DueDate"]=cccc.toString()
                localStorage.setItem("CREDIT CARDS", JSON.stringify(data))
                const notification = new Notification("Credit Card Payment Due", { body: "HDFC Bank Credit Card (Personal) is due today. Amount to be paid is ₹500"});
                break;
            }
        }
    }
}

  }
});

self.periodicSync('CreditCardDueDateChecker', {
  frequency: 'daily',
  startAfter: '6:05 PM',
});


// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  console.log(localStorage.getItem("NameUser"))
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
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return the offline page
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