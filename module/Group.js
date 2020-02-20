const Database = require('./Database.js');
const logger = require('./Logger.js');

async function creategroup(req, decoded){
    let groupcount = await Database.Command('SELECT COUNT(GroupID) as GroupID FROM groups WHERE GroupCreator =  + ' + decoded.id + ';');
    let ispremium = await Database.Command('SELECT IsPremium FROM user WHERE UserID =  + ' + decoded.id + ';');
    let groupnameexist = await Database.Command('SELECT Groupname FROM groups WHERE Groupname = "' + req.body.groupname + '"');

    return new Promise(result => {
        if(groupnameexist == null){
            if(groupcount[0].GroupID <= 3 && ispremium[0].IsPremium == 0 || groupcount[0].GroupID <= 6 && ispremium[0].IsPremium == 1){    
                if(req.body.groupname.length > 3){
                    if(ispremium[0].IsPremium == 0){
                        Database.Command('INSERT INTO groups(Groupname,IsPremium,IsPublic,GroupCreator)VALUES("' + req.body.groupname + '",' + 0 + ',' + req.body.ispublic + ',' + decoded.id + ');');
                        logger.Debug("Group " + req.body.groupname + " was created by", decoded.id);
                    }else{
                        logger.Debug("Group " + req.body.groupname + " was created by", decoded.id);
                        Database.Command('INSERT INTO groups(Groupname,IsPremium,IsPublic,GroupCreator)VALUES("' + req.body.groupname + '",' + 1 + ',' + req.body.ispublic + ',' + decoded.id + ');');
                    }
                    result(0);
                }else{
                    result(2);
                }
            }else{
                result(1);
            }
        }else{
            result(3);
        }
    });
}

module.exports = {
    creategroup
}