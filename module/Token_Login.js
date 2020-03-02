const jwt = require('jsonwebtoken');
const config = require('./config.json');
const Database = require('./Database.js');
const logger = require('./Logger.js');

async function userLogin(username,password){
    logger.Debug("User tries to login", username);
    let userinfo = await Database.Command("SELECT * FROM user WHERE Username like '" + username + "' and Password like '" + password + "';");
    if(userinfo != null){
        return jwt.sign({ id : userinfo[0].UserID, name : userinfo[0].Username, IsPremium : userinfo[0].IsPremium}, config.Token.Secret ,{
            expiresIn : 86400
        });
    }else{
        return null;
    }
}

module.exports = {
    userLogin
}
