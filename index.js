const express = require('express');
const app = express();
const router = require('./router.js') 

app.get('/', function (req, res) {
  res.send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
});

app.get('/debug', function (req, res) {
    router.Debug(req, res);
});

app.listen(3000, function () {
    console.log('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
});