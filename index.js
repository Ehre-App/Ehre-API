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

app.post('/creategroup',(req, res) => {
    router.createGroup(req, res);
});

app.post('/addusertogroup',(req, res) => {
    router.addusertogroup(req, res);
});

app.post('/removeuser',(req, res) => {
    router.removeuserfromgroup(req, res);
});

app.post('/addadmin',(req, res) => {
    router.addAdmin(req, res);
});

app.post('/revokeadmin',(req, res) => {
    router.revokeadmin(req, res);
});

app.post('/deletegroup',(req, res) => {
    router.deletegroup(req, res);
});

app.post('/leavegroup',(req, res) => {
    router.leavegroup(req, res);
});

app.post('/joingroup',(req, res) => {
    router.joingroup(req, res);
});

app.post('/searchgroup',(req, res) => {
    router.searchPublicGroup(req, res);
});

app.get('/mygroups',(req, res) => {
    router.mygroups(req, res);
});

app.post('/useringroup',(req, res) => {
    router.useringroup(req, res);
});

app.post('/ranksingroup',(req, res) => {
    router.ranksingroups(req, res);
});

app.post('/userranks',(req, res) => {
    router.userranks(req, res);
});

app.post('/addrank',(req, res) => {
    router.addRank(req, res);
});

app.listen(3000, function () {
    logger.Log("Ehre-Api is running!");
});
