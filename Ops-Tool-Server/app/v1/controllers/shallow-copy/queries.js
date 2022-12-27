const _ = require("lodash");
const async = require("async");
var DB = require("../../../../config/database");
var logger = require("../../../utils/loggerUtil");
const validatorUtil = require("../../../utils/validatorUtil");
var pool = require('../../../../config/database');
const uuidV1 = require('uuid/v1');
const _CONSTANTS = require("../../../../config/constants");

const insertShallowCopyRequest = function(configObj,data) {
    return new Promise(async function (resolve, reject) {
  
      let insertSql = `INSERT INTO CONTENT_SHALLOW_COPY (processId,channelId,userId,userInfo,frameworkId,excelPath,startTime,endTime,status,executor_info) VALUES ('${configObj.process_id}','${configObj.strChannel}','${configObj.strUserId}','${configObj.userName}','${configObj.strFramework}','${configObj.excelPath}','${validatorUtil.getMomentDateTime()}','${validatorUtil.getMomentDateTime()}','process','${configObj.executor_info}')`;
  
      logger.generateLogger("info", "{{REQUEST}}", "CREATE CONTENT_SHALLOW_COPY SQL DB ENTRY=====>" + insertSql, "initShallowCopy", data);
  
      pool.query(insertSql, function (err, result, fields) {
        if (err) {
          logger.generateLogger("error", "{{RESPONSE}}", "FAILED TO CREATE BATCH PROCESS", "initShallowCopy", data);
          reject({
            "status": 500, "error": 'Failed to create batch process', "response": null
          });
        }
        resolve(`${result.insertId}`);
      });
    }); 
  }

  const updatePassShallowCopy = function (configObj,data) {
    return new Promise( async function (resolve, reject) {
      let updateSql = `UPDATE CONTENT_SHALLOW_COPY SET status = 'completed' WHERE processId = '${configObj.process_id}'`;
      logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT SHALLOW COPY DB QUERY ::: ' + updateSql, 'DB QUERY', data);
      pool.query(updateSql, function (err, results) {
        if (err) {
          logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT SHALLOW COPY STATUS ' + JSON.stringify(err), 'DB QUERY', data);
          reject(err);
        };
        logger.generateLogger('info', '{{RESPONSE}}', 'PROCESS SUCCESSFULLY EXECUTED ::: PROCESS ID ::' + configObj.process_id, 'initShallowCopy', data);
        resolve();
      });
    });
  };

  const updateShallowCopyFailStatus = function (configObj, reason, data){
    return new Promise( async function (resolve, reject) {
      let updateSql = `UPDATE CONTENT_SHALLOW_COPY SET status = 'failed' AND failureReason='${reason}' WHERE processId = '${configObj.process_id}'`;
      logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT SHALLOW COPY DB QUERY ::: ' + updateSql, 'DB QUERY', data);
      pool.query(updateSql, function (err, results) {
        if (err) {
          logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT SHALLOW COPY STATUS ' + JSON.stringify(err), 'DB QUERY', data);
          reject(err);
        };
        logger.generateLogger('info', '{{RESPONSE}}', 'UPDATED CONTENT_SHALLOW_COPY DB TABLE WITH THE FAILED STATUS', 'initShallowCopy', data);
        resolve();
      });
    });
  }

  const insertShallowContentInfoReq = function(configObj, key, data) {
    return new Promise(function (resolve, reject) {
      var strtDt = validatorUtil.getMomentDateTime(),
      endDt = validatorUtil.getMomentDateTime()
  
    let temp = {
      RecordSequenceNo: `${ uuidV1()}`,
      batch_processId: `${configObj.process_id}`,
      userName: `${configObj.userName}`,
      channelId:`${configObj.strChannel}`,
      startTime:`${strtDt}`,
      endTime:`${endDt}`,
      status:'pending',
      content_identifier:'',
      contentOrigin:`${key['strContentOrigin']}`,
      Board:`${key['strBoard']}`,
      Grade:`${key['strGrade']}`,
      Subject:`${key['strSubject']}`,
      Medium:`${key['strMedium']}`,
      failure_reason:'',
      publishStatus:''
    }
  
      logger.generateLogger('info', '{{REQUEST}}', 'ADDING to SHALLOW_CONTENT_INFO DB SQL===>' + JSON.stringify(temp), 'initShallowCopy', data);
      pool.query(_CONSTANTS.INSERT_TO_SHALLOW_CONTENT_INFO,temp, function (err, result, fields) {
        if (err) {
          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN ADDING to SHALLOW_CONTENT_INFO DB SQL===>' + err, 'initShallowCopy', data);
          reject("Failed to create shallow content info" + err);
        }
        logger.generateLogger('info', '{{RESPONSE}}', 'ADDED CONTENTS TO SHALLOW_CONTENT_INFO DB SQL===>' + `${result.insertId}`, 'initShallowCopy', data);
        resolve(`${result.insertId}`);
      })
    });
  }
  
  const updateFailedShallowContent = function (error,resultInsertId, data) {
    return new Promise( async function (resolve, reject) {
      let errs = error.toString();
      errs = errs.replace(/'/g, "\\'");
      let updtStmt = `UPDATE SHALLOW_CONTENT_INFO SET content_identifier = '', failure_reason='${errs}', status= 'failure', endTime='${validatorUtil.getMomentDateTime()}', updatedAt='${validatorUtil.getMomentDateTime()}' WHERE id = '${resultInsertId}'`;
      logger.generateLogger('info', '{{DATA}}', 'UPDATING SHALLOW CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
      pool.query(updtStmt, function (errors, result, fields) {
        if (errors) {
          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING SHALLOW CONTENT INFO ' + JSON.stringify(errors), 'DB QUERY', data);
          reject(errors);
        }
        logger.generateLogger('error', '{{RESPONSE}}', 'UPDATED SHALLOW CONTENT INFO ' + JSON.stringify(result), 'DB QUERY', data);
        resolve();
      });
    });
  };
  
  const updatePassShallowContent = function (createdata, resultInsertId, data) {
    return new Promise( async function (resolve, reject) {
      let updtStmt = "UPDATE SHALLOW_CONTENT_INFO SET content_identifier = '" + (createdata.copy_content_id) + "', publishStatus= '" + (createdata.publishStatus) + "', status= 'success', endTime='" + validatorUtil.getMomentDateTime() + "', updatedAt='" + validatorUtil.getMomentDateTime() + "' WHERE id = " + `${resultInsertId}`;
      logger.generateLogger('info', '{{DATA}}', 'UPDATING SHALLOW CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
      pool.query(updtStmt, function (err, result, fields) {
        if (err) {
          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING SHALLOW CONTENT INFO ' + JSON.stringify(err), 'DB QUERY', data);
          reject(err);
        }
        resolve();
      });
  
    });
  }

  module.exports = {
    insertShallowCopyRequest,
    updatePassShallowCopy,
    updateShallowCopyFailStatus,
    insertShallowContentInfoReq,
    updateFailedShallowContent,
    updatePassShallowContent
  };