const modulelogin = require('./module/Token_Login.js');
const Database = require('./module/Database.js');

function Debug(req, res){
    console.log("[" + new Date().toLocaleTimeString() + "] Ehre-Api is running!");
    Database.Command('SELECT * FROM Test;');
    res.status(200).send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
}

module.exports = {
    Debug
}