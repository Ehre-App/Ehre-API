const Database = require('./Database.js');
const logger = require('./Logger.js');

async function createUser(req){
    let ress = await Database.Command('SELECT UserID FROM user WHERE BINARY Username = "' + req.body.username + '" or email = "' + req.body.email + '";');
    return new Promise(result => {
        if(ress == null){
            if(req.body.password.length > 6){
                Database.Command('INSERT INTO user(`Username`, `Password`, `EMail`, `IsPremium`)VALUES(" ' + req.body.username + '","' + req.body.password + '","' + req.body.email + '",0);');
                result(0);
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

module.exports = {
    createUser
}