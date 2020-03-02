const Database = require('./Database.js');
const logger = require('./Logger.js');

async function mygroups(UserID){
    let Groups = await Database.Command('SELECT groups.Groupname FROM groups INNER JOIN useringroup ON groups.GroupID = useringroup.GroupID WHERE useringroup.UserID = ' + UserID);
    return Groups;
}

module.exports = {
    mygroups
}