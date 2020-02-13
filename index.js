const express = require('express');
const app = express();
const router = require('./router.js') 
const logger = require('./module/logger.js');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
});

app.get('/debug', function (req, res) {
    router.Debug(req, res);
});

app.listen(3000, function () {
    logger.Log("Ehre-Api is running!");
});