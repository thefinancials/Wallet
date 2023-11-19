function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
      return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }

  function investmentstostorage(data)
  {
    userName = JSON.parse(data)["user_id"]
    localStorage.setItem("Wallet", data)
  }
  
  function setToStorage(data)
  {
      userName = JSON.parse(data)["user_id"]
      localStorage.setItem("Wallet", data)
      localforage.setItem("Wallet", data, function(err, value){})      
      fetch(`https://nkafepwcnjcdvngvyrgz.supabase.co/rest/v1/UserData?user_id=eq.${userName}`, {
      method: "PATCH",
      body: JSON.stringify({ "user_id": userName, "Details": data}),
      headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWZlcHdjbmpjZHZuZ3Z5cmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyMjk4NTgsImV4cCI6MjAwODgwNTg1OH0.N0WVNuW3S-6Fa6sgMfnLcvORYk7oawfEeUAdJ-IUCH8",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWZlcHdjbmpjZHZuZ3Z5cmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyMjk4NTgsImV4cCI6MjAwODgwNTg1OH0.N0WVNuW3S-6Fa6sgMfnLcvORYk7oawfEeUAdJ-IUCH8",
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
   }
   });
}

function logoutFunction()
{
  if(confirm("Are you sure you wish to logout from this device? Your data will remain securely saved in the cloud?"))
  {
    localStorage.removeItem("Wallet")
    localforage.removeItem("Wallet", function(err, value){})
    window.location.reload()
  }
}

