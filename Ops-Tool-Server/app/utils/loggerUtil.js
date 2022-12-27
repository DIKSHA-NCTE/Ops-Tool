const _ = require('lodash');
const logger = require('../../config/winston');

const generateString = function(level,message,label,method,data){
    return `[${method} ::: ${label} ::: ${message}] {{USER ID ::: ${data.userId}}} {{USER NAME ::: ${data.userName}}}`
}

const generateLogger = function(level,msg,label,method,data) {
    if(level=="info"){
        logger.info(generateString(level,msg,label,method,data));
    }else if(level=="error"){
        logger.error(generateString(level,msg,label,method,data));
    }else if(level=="warn"){
        logger.warn(generateString(level,msg,label,method,data));
    }
    return true;
}

module.exports = {
    generateLogger
};