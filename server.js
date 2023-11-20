const express = require('express')
const path = require('path');
const axios = require('axios');

var objectPrices = {};
let priceOfSBIN = '';

const app = express();
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Home.html"));
});

app.get("/localforage.js", (req, res) => {
  res.sendFile(path.join(__dirname, "localforage.js"));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/pwabuilder-sw.js", (req, res) => {
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

app.get('/getData', async (req, res) => {
    const symbol = req.query.symbol;
    const axios = require('axios');
    const cheerio = require('cheerio');
    axios.get(`https://www.google.com/finance/quote/${symbol}:NSE`) 
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const spanElement = $('div.YMlKec.fxKbKc');
        res.send(spanElement.text())
      })
      .catch(error => {
        console.error(error);
      });
    

});
  
app.listen(8080, () => {
    console.log("Server started in port 8080. Visit localhost:8080")
})
