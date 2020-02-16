const config = require('./config.json');
const mysql = require('mysql');
const logger = require('./Logger.js');

var Database_Connection = mysql.createConnection({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password,
    database: config.Database.Database,
    typeCast: function (field, next) {
        if (field.type == "BIT" && field.length == 1) {
            var bit = field.string();

            return (bit === null) ? null : bit.charCodeAt(0);
        }
        return next();
    }
    
});

Database_Connection.connect(function(err){
    if(err){
        throw err;
    }else{
        logger.Log("Connected to Database!");
    }
});

function Command(query){
    return new Promise(res =>{
        Database_Connection.query(query,function(err, result){
            if(err){
                console.log("[ERROR]" + err);
                res(0); 
                if(config.Debug){
                    throw err;
                }
            }else{
                if(result.length === 0){
                    res(null);
                }else{
                    res(result);
                }
            }
        });
    });
}

module.exports = {
    Command
}