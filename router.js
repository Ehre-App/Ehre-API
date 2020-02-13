const modulelogin = require('./module/Token_Login.js');
const Database = require('./module/Database.js');
const logger = require('./module/logger.js');

function Debug(req, res){
    logger.Log("Ehre-Api is running!");
    Database.Command('SELECT * FROM Test;');
    res.status(200).send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
}

async function gettoken(req, res){
    if(req.body.username != null && req.body.password != null){
        let Token = await modulelogin.userLogin(req.body.username,req.body.password);
        if(Token != null){
            res.status(200).send({ auth: true, Token: Token });
        }else{
            res.status(401).send('Wrong password or username!');
        }
    }else{
        res.status(401).send('Not all attributes');
    }
}

module.exports = {
    Debug,
    gettoken
}