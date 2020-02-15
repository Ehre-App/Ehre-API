const express = require('express');
const app = express();
const router = require('./router.js') 
const logger = require('./module/Logger.js');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
});

app.post('/debug', function (req, res) {
    router.debug(req, res);
});

app.post('/login',(req, res) => {
    router.getToken(req, res);
});

app.post('/createuser',(req, res) => {
    router.createUser(req,res);
});


app.listen(3000, function () {
    logger.Log("Ehre-Api is running!");
});
