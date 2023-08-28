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

function isStatementGeneratedForMonth(transactions, month, year, cardname) {
  for (const transaction of transactions) {
    if (
      transaction.Particulars === "Statement generated" &&
      transaction.Date.startsWith(`${year}-${month}`) && transaction.CreditCard ==cardname
    ) {
      return true;
    }
  }
  return false;
}

function showNotification(messagee) {
  if(Notification.permission==='granted'){
    const options = {
      body: messagee,
    };

    self.registration.showNotification('Statement generated', options)
  }
}
function getDailyNewsInCache() {
  localforage.getItem("Wallet", function(err, value) {
    if (!err) {
      data = value["CREDIT CARDS"]
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
              if(curre>=cccc)
              {
                  cccc.setMonth(cccc.getMonth()+1)
                  if(cccc.getMonth()==0)
                  {
                      cccc.setFullYear(cccc.getFullYear()+1)
                  }
                  
                  trrr = data["TRANSACTIONS"]           
                  let statementGenerated = isStatementGeneratedForMonth(trrr, new Date().getMonth()+1, new Date().getFullYear(), keeey)  
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
                      oridata["CREDIT CARDS"]=data
                      localforage.setItem("Wallet", JSON.stringify(oridata))
                      localforage.setItem("TOWRITE", JSON.stringify(oridata))
                      showNotification(`Statement for ${keeey} has become due. Amount to be paid is ₹${data[keeey]["BalanceOutstanding"]}`)                      
                  }
              }
              else
              {
                console.log("No statements generated")
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
