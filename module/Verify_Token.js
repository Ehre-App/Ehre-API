const logger = require('./Logger.js');
const jwt = require('jsonwebtoken');
const config = require('./config.json');

function Verify(req){
    return new Promise(result => {
        var token = req.headers['x-access-token'];
        if(!token){
            logger.Debug("No Token", null);
            result(0);
        }
        
        jwt.verify(token, config.Token.Secret, function(err, decoded) {
            if(err){
                logger.Debug("Token", err);
                result(0);
            }
        });
        result(1);
    });
}

module.exports = {
    Verify
}