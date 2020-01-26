const jwt = require('jsonwebtoken');

async function userLogin(req, res){
    if(req.body.username != null && req.body.password != null){

    }else{
        res.status(401).send('Not all attributes');
    }
}