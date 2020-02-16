const moduleTokenLogin = require('./module/Token_Login.js');
const modulelDatabase = require('./module/Database.js');
const modulelLogger = require('./module/Logger.js');
const modulelVerifyToken = require('./module/Verify_Token.js');
const moduleCreateUser = require('./module/Create_User.js');
const moduleCreateGroup = require('./module/Create_Group.js');
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
        if(req.body.groupname != null && req.body.ispublic != null && req.body.ispremium != null){
            switch(await moduleCreateGroup.creategroup(req, decoded)){
                case  0:
                    res.status(200).send('Group!');
                break;
                case 1:
                    res.status(401).send('You can no longer create groups');
                break;
                case 2:
                    res.status(401).send('Groupname is too short');
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
    createGroup
}