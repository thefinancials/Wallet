const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.set('view engine', 'ejs');
app.get('/getData', async (req, res) => {
    const symbol = req.query.symbol;
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
