const express = require('express')
const path = require('path');
const axios = require('axios');

var objectPrices = {};
let priceOfSBIN = '';

const app = express();
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, page));
});

app.get("/localforage.js", (req, res) => {
  res.sendFile(path.join(__dirname, "localforage.js"));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("pwabuilder-sw.js", (req, res) => {
  res.sendFile(path.join(__dirname, "pwabuilder-sw.js"));
});

app.get("/Assets/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname,"Assets", page));
});

app.get("/Pages/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname,"Pages", page));
});

app.get("/getExpiry", async(req, res)=>{
  axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY')
  .then(response => {
    const data = response.data
    const expiryDates = data["records"]["expiryDates"]
    res.send(expiryDates)
  })
})
app.get("/getOption", async(req, res)=>{
  const strikePrice = parseInt(req.query.strikked)
  const expiry = ((req.query.exxpiry).replace('"', "")).replace('"', "")
  const cepe = req.query.option
  axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY')
  .then(response => {
    // The JSON data will be available in the `response.data` property
    const jsonData = response.data;
    parsedData = jsonData
    const desiredOption = parsedData.records.data.find(option => {
      return option.strikePrice === strikePrice && option.expiryDate === expiry && option[cepe];
    });
    if (desiredOption) {
      const lastPrice = (desiredOption[cepe].lastPrice).toString();
      res.send(lastPrice)
    } else {
      return null;
    }
    
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

})
app.get('/getData', async (req, res) => {
    const symbol = req.query.symbol;
    const axios = require('axios');
    const cheerio = require('cheerio');
    axios.get(`https://www.google.com/finance/quote/${symbol}:NSE`) // Replace with your target URL
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const spanElement = $('div.YMlKec.fxKbKc');
        res.send(spanElement.text())
      })
      .catch(error => {
        console.log(error);
      });
    

});
  
app.listen(8080, () => {
    console.log("Server started in port 8080. Visit localhost:8080")
})