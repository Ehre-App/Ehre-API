const moduleTokenLogin = require('./module/Token_Login.js');
const modulelLogger = require('./module/Logger.js');
const modulelVerifyToken = require('./module/Verify_Token.js');
const moduleCreateUser = require('./module/Create_User.js');
const moduleGroup = require('./module/Group.js');
const moduleUserGroup = require('./module/User_Group.js');
const moduleUser = require('./module/User.js');
const config = require('./module/config.json');

async function debug(req, res){
    if(config.Debug == 1){
        let verify = await verifyToken(req, res);
        if(verify == 1){
            modulelLogger.Log("Ehre-Api is running!");
            res.status(200).send('[' + new Date().toLocaleTimeString() + '] Ehre-Api is running!');
        }
    }
}

async function getToken(req, res){
    if(req.body.username != null && req.body.password != null){
        let Token = await moduleTokenLogin.userLogin(req.body.username,req.body.password);
        if(Token != null){
            res.status(200).send({ auth: true, Token: Token });
        }else{
            res.status(401).send('Wrong password or username!');
        }
    }else{
        res.status(401).send('Not all attributes');
    }
}

async function verifyToken(req, res){
    let verifyToken = await modulelVerifyToken.Verify(req);
    if(verifyToken == 1){
        return 1;
    }else{
        res.status(401).send({ auth: false, message: 'Failed to authenticate token or no token provided.' });
        return 0;
    }
}

async function createUser(req, res){
    if(req.body.username != null && req.body.password != null && req.body.email != null){
        switch(await moduleCreateUser.createUser(req)){
            case 0:
                res.status(201).send('User created');
            break;
            case 1:
                res.status(401).send('Username or Email has already been used');
            break;
            case 2:
                res.status(401).send('Password is too short');
            break;
        }
    }else{
        res.status(401).send('Not all attributes');
    }
}

async function createGroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupname != null && req.body.ispublic != null){
            switch(await moduleGroup.creategroup(req.body.groupname, req.body.ispublic, decoded.IsPremium, decoded)){
                case 0:
                    res.status(200).send('Group!');
                    moduleUserGroup.useringroup(req.body.groupname, decoded.id);
                break;
                case 1:
                    res.status(401).send('You can no longer create groups');
                break;
                case 2:
                    res.status(401).send('You already have a group with this name');
                break;
                case 3:
                    res.status(401).send('A Public Group with this name already exists');
                break;
                case 4:
                    res.status(401).send('Groupname is too short');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function addusertogroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    if(await verifyToken(req, res) == 1){
        if(req.body.adduser != null && req.body.groupid != null){
            switch(await moduleUserGroup.adduser(req, decoded)){
                case 0:
                    res.status(200).send('Added!');
                break;
                case 1:
                    res.status(401).send('You are not the Admin of this Group');
                break;
                case 2:
                    res.status(401).send('The Group is full');
                break;
                case 3:
                    res.status(401).send('User not exists');
                break;
                case 4:
                    res.status(401).send('User is all already in Group');
                break;
                case 4:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function removeuserfromgroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    if(await verifyToken(req, res) == 1){
        if(req.body.removeuser != null && req.body.groupid != null){
            switch(await moduleUserGroup.removeuser(req.body.groupid, req.body.removeuser, decoded)){
                case 0:
                    res.status(200).send('User removed');
                break;
                case 1:
                    res.status(401).send('You are not an Admin of this Group');
                break;
                case 2:
                    res.status(401).send('User is not in Group');
                break;
                case 3:
                    res.status(401).send('You can\'t remove an Admin');
                break;
                case 4:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function addAdmin(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    
    if(await verifyToken(req, res) == 1){
        if(req.body.userid != null && req.body.groupid != null){
            switch(await moduleUserGroup.addadmin(req.body.groupid, req.body.userid , decoded)){
                case 0:
                    res.status(200).send('User was promoted to admin');
                break;
                case 1:
                    res.status(401).send('You are not a Admin of this Group');
                break;
                case 2:
                    res.status(401).send('User is not in Group');
                break;
                case 3:
                    res.status(401).send('User is already a Admin');
                break;
                case 4:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function revokeadmin(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.userid != null && req.body.groupid != null){
            switch(await moduleUserGroup.revokeadmin(req.body.groupid, req.body.userid , decoded)){
                case 0:
                    res.status(200).send('The rights form this user was removed');
                break;
                case 1:
                    res.status(401).send('You are not a Admin of this Group');
                break;
                case 2:
                    res.status(401).send('User is not in Group');
                break;
                case 3:
                    res.status(401).send('User has no Admin right');
                break;
                case 4:
                    res.status(401).send('User is the Creator of this Group');
                break;
                case 5:
                    res.status(401).send('One admin is required');                   
                break;
                case 6:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function leavegroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleUserGroup.leavegroup(req.body.groupid, decoded)){
                case 0:
                    res.status(200).send('You left the Group'); 
                break;
                case 1:
                    res.status(401).send('Your not a part of this Group');
                break;
                case 2:
                    res.status(401).send('You cant\'t leave this Group');                   
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function deletegroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleGroup.deletegroup(req.body.groupid, decoded)){
                case 0:
                    res.status(200).send('Group deletet'); 
                break;
                case 1:
                    res.status(401).send('Group does not exist');
                break;
                case 2:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function joingroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleUserGroup.joingroup(req.body.groupid, decoded)){
                case 0:
                    res.status(200).send('You joined the Group'); 
                break;
                case 1:
                    res.status(401).send('Your already in this Group');
                break;
                case 2:
                    res.status(401).send('The Group is full');
                break;
                case 3:
                    res.status(401).send('The Group does not exist');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function mygroups(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    let Groups = await moduleUser.mygroups(decoded.id);

    if(await verifyToken(req, res) == 1){
        res.status(200).send(Groups);
    }
}

async function useringroup(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
    let users = await moduleUser.usersingroup(req.body.groupid, decoded);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleUser.usersingroup(req.body.groupid, decoded)){
                case 0:
                    res.status(401).send('The Group does not exist');
                break;
                case 1:
                    res.status(401).send('Your not a part of this Group');
                break;
                default:
                    res.status(200).send(users); 
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }        
    }
}

async function searchPublicGroup(req, res){
    if(await verifyToken(req, res) == 1){
        if(req.body.groupname != null){
            let groups = await moduleGroup.searchpublicgroups(req.body.groupname);
            res.status(200).send(groups); 
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function ranksingroups(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleGroup.ranksingroups(req.body.groupid, decoded)){
                case 0:
                    let ranks = await moduleGroup.ranks(req.body.groupid);
                    res.status(200).send(ranks); 
                break;
                case 1:
                    res.status(401).send('The Group does not exist');
                break;
                case 2:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

async function userranks(req, res){
    let decoded = await modulelVerifyToken.decoded(req);
   
    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null){
            switch(await moduleGroup.userrank(req.body.groupid, decoded)){
                case 0:
                    let ranks = await moduleGroup.userandranks(req.body.groupid);
                    res.status(200).send(ranks); 
                break;
                case 1:
                    res.status(401).send('The Group does not exist');
                break;
                case 2:
                    res.status(401).send('Your not a part of this Group');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }  
}

async function addRank(req, res){
    let decoded = await modulelVerifyToken.decoded(req);

    if(await verifyToken(req, res) == 1){
        if(req.body.groupid != null && req.body.rankvalue != null && req.body.Rankname != null){
            switch(await moduleGroup.addRank(req.body.groupid, decoded, req.body.rankvalue, req.body.Rankname)){
                case 0:
                    res.status(401).send('Rank Createt');
                break;
                case 1:
                    res.status(401).send('The Group does not exist');
                break;
                case 2:
                    res.status(401).send('You are not a Admin of this Group');
                break;
                case 3:
                    res.status(401).send('You already have rank with this value');
                break;
            }
        }else{
            res.status(401).send('Not all attributes');
        }
    }
}

module.exports = {
    debug,
    getToken,
    createUser,
    createGroup,
    addusertogroup,
    removeuserfromgroup,
    addAdmin,
    revokeadmin,
    leavegroup,
    deletegroup,
    joingroup,
    mygroups,
    useringroup,
    searchPublicGroup,
    ranksingroups,
    userranks,
    addRank
}