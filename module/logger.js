const config = require('./config.json');

function Debug(text, value){
    if(config.Debug == 1){
        console.log("[" +  new Date().toLocaleTimeString() + "]" + config.Logger.DebugPrefix + text + " : " + value);
    }
}

function Log(text){
    console.log("[" + new Date().toLocaleTimeString() + "]" + config.Logger.LoggerPrefix + text);
}

module.exports = {
    Debug,
    Log
}