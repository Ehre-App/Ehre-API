const Database = require('./Database.js');
const logger = require('./Logger.js');

async function adduser(req, decoded){
    let userid = decoded.id
    let groupinfo = await Database.Command("SELECT GroupID,IsPremium,IsPublic FROM groups WHERE GroupID = " + req.body.groupid);
    let userisadmin = await Database.Command("SELECT Isadmin FROM useringroup WHERE UserID = " + userid + " AND GroupID = " + req.body.groupid);
    let useringroup = await Database.Command("SELECT Count(UserID) AS UserCount FROM useringroup WHERE GroupID = " + req.body.groupid);
    let isuseringroup = await Database.Command("SELECT UserID FROM useringroup WHERE GroupID = " + req.body.groupid + " AND UserID =" + req.body.adduser);
    let userexist = await Database.Command("SELECT UserID FROM user WHERE UserID =" + req.body.adduser); 


    return new Promise(result => {
        if(userisadmin[0].Isadmin == 1){
            if(useringroup[0].UserCount <= 20 && groupinfo[0].IsPremium == 0 && groupinfo[0].IsPublic == 0 || useringroup[0].UserCount <= 80 && groupinfo[0].IsPremium == 1 && groupinfo[0].IsPublic == 0){
                if(userexist != null){
                    if(isuseringroup == null){
                        logger.Debug("User " + req.body.adduser + " added to Group", req.body.groupid);
                        Database.Command('INSERT INTO useringroup(GroupID, UserID) VALUES(' + groupinfo[0].GroupID + ',' + req.body.adduser + ')');
                        result(0);
                    }else{
                        result(4);
                    }
                }else{
                    result(3);
                }
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

async function useringroup(Groupname, UserId){
    let Groupinfos = await Database.Command('SELECT GroupID,GroupCreator FROM groups WHERE Groupname = "' + Groupname + '" AND GroupCreator ="' + UserId + '"');
    if(Groupinfos != null){
        if(Groupinfos[0].GroupCreator == UserId){
            Database.Command('INSERT INTO useringroup(GroupID, UserID, Isadmin) VALUES(' + Groupinfos[0].GroupID + ',' + UserId + ',1)');
            logger.Debug("User " + UserId + " Added into useringroup | Group", Groupinfos[0].GroupID);
        }
    }
}

async function removeuser(GroupID, UserId, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID,Isadmin FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ UserId);
    let GroupAdmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);

    return new Promise(result => {
        if(GroupAdmin[0].Isadmin == 1){
            if(Groupinfos != null){
                if(Groupinfos[0].Isadmin == 0){
                    Database.Command('DELETE FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID = ' + UserId);
                    logger.Debug("User " + UserId + " remove from Group", GroupID);
                    result(0);
                }else{
                    result(3);
                }
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

async function addadmin(GroupID, UserId, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID,Isadmin FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ UserId);
    let GroupAdmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);
    
    return new Promise(result => {
        if(GroupAdmin[0].Isadmin == 1){
            if(Groupinfos != null){
                if(Groupinfos[0].Isadmin == 0){
                    Database.Command('UPDATE useringroup set Isadmin = 1 WHERE GroupID = ' + GroupID + ' AND UserID =' + UserId);
                    logger.Debug("User " + UserId + " was promoted to admin in Group", GroupID);
                    result(0);
                }else{
                    result(3);
                }
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

module.exports = {
    adduser,
    useringroup,
    removeuser,
    addadmin
}