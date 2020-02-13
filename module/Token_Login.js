const jwt = require('jsonwebtoken');
const config = require('./config.json');
const Database = require('./Database.js');
const logger = require('./logger.js');

async function userLogin(username,password){
    logger.Debug("User tries to login", username);
    let userinfo = await Database.Command("SELECT * FROM user WHERE Username like '" + username + "' and Password like '" + password + "';");
    if(userinfo != null){
        return jwt.sign({ id : userinfo.id, name : userinfo.username, isadmin : userinfo.IsPremium}, config.Token.Secret ,{
            expiresIn : 86400
        });
    }else{
        return null;
    }
}


module.exports = {
    userLogin
}
