const config = require('./config.json');
const mysql = require('mysql');

var Database_Connection = mysql.createConnection({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password,
    database: config.Database.Database
});

Database_Connection.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("[Info]Connected to Database!");
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
                res(result);
            }
        });
    });
}

module.exports = {
    Command
}