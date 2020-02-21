const Database = require('./Database.js');
const logger = require('./Logger.js');

async function adduser(req, decoded){
    let userid = decoded.id
    
    let groupinfo = await Database.Command('SELECT GroupID,IsPremium,IsPublic FROM groups WHERE GroupID = ' + req.body.groupid);
    let userisadmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE UserID = ' + decoded.id + ' AND GroupID = ' + req.body.groupid);
    let useringroup = await Database.Command('SELECT Count(UserID) AS UserCount FROM useringroup WHERE GroupID = ' + req.body.groupid);
    let isuseringroup = await Database.Command('SELECT UserID FROM useringroup WHERE GroupID = ' + req.body.groupid + ' AND UserID =' + req.body.adduser);
    let userexist = await Database.Command('SELECT UserID FROM user WHERE UserID =' + req.body.adduser); 

    console.log('SELECT Isadmin FROM useringroup WHERE UserID = ' + decoded.id + ' AND GroupID = ' + req.body.groupid);

    return new Promise(result => {
        if(userisadmin != null){
            if(userisadmin[0].Isadmin == 1){
                if(useringroup[0].UserCount <= '20' && groupinfo[0].IsPremium == '0' && groupinfo[0].IsPublic == '0' || useringroup[0].UserCount <= '80' && groupinfo[0].IsPremium == '1' && groupinfo[0].IsPublic == '0'){
                    if(userexist != null){
                        if(isuseringroup == null){
                            logger.Debug('User ' + req.body.adduser + ' added to Group', req.body.groupid);
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
        }else{
            result(5);
        }
    });
}

async function useringroup(Groupname, UserId){
    let Groupinfos = await Database.Command('SELECT GroupID,GroupCreator FROM groups WHERE Groupname = "' + Groupname + '" AND GroupCreator ="' + UserId + '"');
    if(Groupinfos != null){
        if(Groupinfos[0].GroupCreator == UserId){
            Database.Command('INSERT INTO useringroup(GroupID, UserID, Isadmin) VALUES(' + Groupinfos[0].GroupID + ',' + UserId + ',1)');
            logger.Debug('User ' + UserId + ' Added into useringroup | Group', Groupinfos[0].GroupID);
        }
    }
}

async function useroutgroup(GroupID, UserID){
        Database.Command('DELETE FROM useringroup WHERE UserID =' + UserID + ' AND GroupID =' + GroupID);
        logger.Debug('User ' + UserID + 'was removed from Group', GroupID);
}

async function removeuser(GroupID, UserId, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID,Isadmin FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ UserId);
    let GroupAdmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);

    return new Promise(result => {
        if(GroupAdmin != null){
            if(GroupAdmin[0].Isadmin == 1){
                if(Groupinfos != null){
                    if(Groupinfos[0].Isadmin == 0){
                        Database.Command('DELETE FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID = ' + UserId);
                        logger.Debug('User ' + UserId + ' remove from Group', GroupID);
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
        }else{
            result(4);
        }
    });
}

async function addadmin(GroupID, UserId, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID,Isadmin FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ UserId);
    let GroupAdmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);
    
    return new Promise(result => {
        if(GroupAdmin != null){
            if(GroupAdmin[0].Isadmin == 1){
                if(Groupinfos != null){
                    if(Groupinfos[0].Isadmin == 0){
                        Database.Command('UPDATE useringroup set Isadmin = 1 WHERE GroupID = ' + GroupID + ' AND UserID =' + UserId);
                        logger.Debug('User ' + UserId + ' was promoted to admin in Group', GroupID);
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
        }else{
            result(4);
        }
    });
}

async function revokeadmin(GroupID, UserId, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID,Isadmin FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ UserId);
    let GroupAdmin = await Database.Command('SELECT Isadmin FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);
    let UserCount = await Database.Command('SELECT Count(UserID) AS UserCount FROM useringroup WHERE GroupID = ' + GroupID + ' AND Isadmin = 1');
    let UserCreator = await Database.Command('SELECT GroupCreator FROM groups WHERE GroupID =' + GroupID);

    return new Promise(result => {
        if(GroupAdmin != null){
            if(GroupAdmin[0].Isadmin == 1){
                if(Groupinfos != null){
                    if(Groupinfos[0].Isadmin == 1){
                        if(UserCreator[0].GroupCreator != UserId){
                            if(UserCount[0].UserCount != 1){
                                Database.Command('UPDATE useringroup set Isadmin = 0 WHERE GroupID = ' + GroupID + ' AND UserID =' + UserId);
                                logger.Debug('User ' + UserId + ' admin rights have been removed in Group', GroupID);
                                result(0);  
                            }else{
                                result(5);
                            }
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
        }else{
            result(6);
        }
    });
}

async function leavegroup(GroupID, decoded){
    let Groupinfos = await Database.Command('SELECT GroupID,UserID FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ decoded.id);
    let UserCreator = await Database.Command('SELECT GroupCreator FROM groups WHERE GroupID =' + GroupID);

    return new Promise(result => {
        if(Groupinfos != null){
            console.log(Groupinfos);
            if(UserCreator[0].GroupCreator != decoded.id){
                Database.Command('DELETE FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID = ' + decoded.id);
                logger.Debug('User ' + decoded.id + ' leave Group', GroupID);
                result(0);
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

async function deletegroup(GroupID, decoded){
    let UserCreator = await Database.Command('SELECT GroupCreator FROM groups WHERE GroupID =' + GroupID);
    let UserinGroup = await Database.Command('SELECT UserID FROM useringroup WHERE GroupID =' + GroupID);
    let Group = await Database.Command('SELECT GroupID FROM groups WHERE GroupID =' + GroupID);

    return new Promise(result => {
        if(Group != null){
            if(UserCreator[0].GroupCreator == decoded.id){
                for(i = 0; i < UserinGroup.length; i++){
                    console.log(i);
                    useroutgroup(GroupID,UserinGroup[i].UserID);
                }
                Database.Command('DELETE FROM groups WHERE GroupID =' + GroupID);
                logger.Debug('Group was removed', GroupID);
                result(0);
            }else{
                result(2);
            }
       }else{
           result(1)
       }
    });
}

async function joingroup(GroupID, decoded){
    let Group = await Database.Command('SELECT GroupID FROM groups WHERE GroupID =' + GroupID);
    let groupinfo = await Database.Command('SELECT GroupID,IsPremium,IsPublic FROM groups WHERE GroupID = ' + GroupID);
    let useringroup = await Database.Command('SELECT Count(UserID) AS UserCount FROM useringroup WHERE GroupID = ' + GroupID);
    let isuseringroup = await Database.Command('SELECT UserID FROM useringroup WHERE GroupID = ' + GroupID + ' AND UserID =' + decoded.id);

    return new Promise(result => {
        if(Group != null){
            if(useringroup[0].UserCount <= '60' && groupinfo[0].IsPremium == '0' && groupinfo[0].IsPublic == '1' || useringroup[0].UserCount <= '140' && groupinfo[0].IsPremium == '1' && groupinfo[0].IsPublic == '1'){
                if(isuseringroup == null){
                    logger.Debug('User ' + decoded.id + ' joined Group', GroupID);
                    Database.Command('INSERT INTO useringroup(GroupID, UserID) VALUES(' + GroupID + ',' + decoded.id + ')');
                    result(0);
                }else{
                    result(1);
                }     
            }else{
                result(2);
            }
        }else{
            result(3);
        }
    });
}

module.exports = {
    adduser,
    useringroup,
    removeuser,
    addadmin,
    revokeadmin,
    leavegroup,
    deletegroup,
    joingroup
}