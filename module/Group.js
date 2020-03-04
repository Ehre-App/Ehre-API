const Database = require('./Database.js');
const logger = require('./Logger.js');

async function creategroup(Groupname, IsPublic, IsPremium, decoded){
    let GroupCout = await Database.Command('SELECT COUNT(GroupID) as GroupID FROM groups WHERE GroupCreator =  + ' + decoded.id + ';');
    let GroupnameExist = await Database.Command('SELECT Groupname FROM groups WHERE Groupname = "' + Groupname + '" AND GroupCreator = ' + decoded.id);
    let PublicGroupExist = await Database.Command('SELECT Groupname FROM groups WHERE Groupname = "' + Groupname + '" AND IsPublic = 1');

    return new Promise(result => {
        if(Groupname.length > 3){
            if(IsPublic == 0){
                if(GroupnameExist == null){
                    if(GroupCout[0].GroupID <= 3 && IsPremium == 0 || GroupCout[0].GroupID <= 6 && IsPremium == 1){
                        logger.Debug('Private Group "' + Groupname + '" was created by', decoded.id);
                        Database.Command('INSERT INTO groups(Groupname,IsPremium,IsPublic,GroupCreator)VALUES("' + Groupname + '",' + IsPremium + ',0,' + decoded.id + ')');
                        result(0);
                    }else{
                        result(1);
                    }
                }else{
                    result(2);
                }
            }else{
                if(PublicGroupExist == null){
                    if(GroupCout[0].GroupID <= 3 && IsPremium == 0 || GroupCout[0].GroupID <= 6 && IsPremium == 1){
                        logger.Debug('Public Group "' + Groupname + '" was created by', decoded.id);
                        Database.Command('INSERT INTO groups(Groupname,IsPremium,IsPublic,GroupCreator)VALUES("' + Groupname + '",' + IsPremium + ',1,' + decoded.id + ')');
                        result(0);
                    }else{
                        result(1);
                    }
                }else{
                    result(3);
                }
            }
        }else{
            result(4);
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

async function searchpublicgroups(Groupname){
    let publicGroups = await Database.Command('SELECT Groupname,GroupID FROM groups WHERE Groupname LIKE "' + Groupname + '%" AND IsPublic = 1');

    return new Promise(result => {
        result(publicGroups);
    });
}

async function useroutgroup(GroupID, UserID){
    Database.Command('DELETE FROM useringroup WHERE UserID =' + UserID + ' AND GroupID =' + GroupID);
    logger.Debug('User ' + UserID + ' was removed from Group', GroupID);
}

async function ranksingroups(GroupID, decoded){
    let Group = await Database.Command('SELECT GroupID FROM groups WHERE GroupID =' + GroupID);
    let Groupinfos = await Database.Command('SELECT GroupID,UserID FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ decoded.id);

    return new Promise(result => {
        if(Group != null){
            if(Groupinfos != null){
                result(0);
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

async function ranks(GroupID){
    let Ranks = await Database.Command('SELECT Rankvalue,Rankname FROM rankingroup WHERE GroupID = ' + GroupID);
    
    return new Promise(result => {
        result(Ranks);
    });
}

async function userrank(GroupID, decoded){
    let Group = await Database.Command('SELECT GroupID FROM groups WHERE GroupID =' + GroupID);
    let Groupinfos = await Database.Command('SELECT GroupID,UserID FROM useringroup WHERE GroupID = "' + GroupID + '" AND UserID = '+ decoded.id);

    return new Promise(result => {
        if(Group != null){
            if(Groupinfos != null){
                result(0);
            }else{
                result(2);
            }
        }else{
            result(1);
        }
    });
}

async function userandranks(GroupID){
    let Ranks = await Database.Command('SELECT Rankvalue,Rankname FROM rankingroup WHERE GroupID = ' + GroupID);
    let user = await Database.Command('SELECT user.Username,useringroup.Ehrevalue FROM user INNER JOIN useringroup ON useringroup.UserID = user.UserID WHERE useringroup.GroupID =' + GroupID);
    var rank = [];
    var users = [];
    var rankuser = [{}];

    return new Promise(result => {
        user.forEach(user => {
            var rank_ = [];
            Ranks.forEach(ranks => {
                if(user.Ehrevalue >= ranks.Rankvalue){
                    rank_.push(ranks.Rankname);
                    
                }
           });
    
           users.push(user.Username);
           rank.push(rank_[rank_.length -1]);
        });
    
        for(var i = 0; i < user.length; i++){
            rankuser[i] = { "Username" : users[i], "Rank" : rank[i]};
        }

        result(rankuser);
    });
}

module.exports = {
    creategroup,
    deletegroup,
    searchpublicgroups,
    ranksingroups,
    ranks,
    userrank,
    userandranks
}