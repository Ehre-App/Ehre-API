const Database = require('./Database.js');
const logger = require('./Logger.js');

async function mygroups(UserID){
    let Groups = await Database.Command('SELECT groups.Groupname FROM groups INNER JOIN useringroup ON groups.GroupID = useringroup.GroupID WHERE useringroup.UserID = ' + UserID);
    return Groups;
}

async function usersingroup(GroupID, decoded){
    let Group = await Database.Command('SELECT GroupID FROM groups WHERE GroupID =' + GroupID);
    let UserinGroup = await Database.Command('SELECT UserID FROM useringroup WHERE GroupID =' + GroupID + ' AND UserID =' + decoded.id);
    let user = await Database.Command('SELECT user.Username FROM user INNER JOIN useringroup ON useringroup.UserID = user.UserID WHERE useringroup.GroupID =' + GroupID);

    return new Promise(result => {
        if(Group != null){
            if(UserinGroup != null){
                result(user);
            }else{
                result(1);
            }
        }else{
            result(0);
        }
    });
}

module.exports = {
    mygroups,
    usersingroup
}