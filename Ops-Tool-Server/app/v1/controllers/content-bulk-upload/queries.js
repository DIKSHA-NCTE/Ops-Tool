const _ = require("lodash");
const async = require("async");
var DB = require("../../../../config/database");
var logger = require("../../../utils/loggerUtil");
const validatorUtil = require("../../../utils/validatorUtil");
var pool = require('../../../../config/database');
const uuidV1 = require('uuid/v1');
const _CONSTANTS = require("../../../../config/constants");


const insertBulkUploadRequest = function(configObj,data) {
  return new Promise(async function (resolve, reject) {

    let insertSql = `INSERT INTO CONTENT_BULK_UPLOAD (processId,channelId,userId,userInfo,frameworkId,excelPath,startTime,endTime,status,executor_info) VALUES ('${configObj.process_id}','${configObj.strChannel}','${configObj.strUserId}','${configObj.userName}','${configObj.strFramework}','${configObj.excelPath}','${validatorUtil.getMomentDateTime()}','${validatorUtil.getMomentDateTime()}','process','${configObj.executor_info}')`;

    logger.generateLogger("info", "{{REQUEST}}", "CREATE CONTENT_BULK_UPLOAD SQL DB ENTRY=====>" + insertSql, "initContentBulkUpload", data);

    pool.query(insertSql, function (err, result, fields) {
      if (err) {
        logger.generateLogger("error", "{{RESPONSE}}", "FAILED TO CREATE BATCH PROCESS", "initContentBulkUpload", data);
        reject({
          "status": 500, "error": 'Failed to create batch process', "response": null
        });
      }
      resolve(`${result.insertId}`);
    });
  }); 
}

const updatePassUpload = function (configObj,data) {
  return new Promise( async function (resolve, reject) {
    let updateSql = `UPDATE CONTENT_BULK_UPLOAD SET status = 'completed' WHERE processId = '${configObj.process_id}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updateSql, 'DB QUERY', data);
    pool.query(updateSql, function (err, results) {
      if (err) {
        logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT BULK UPLOAD STATUS ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      };
      logger.generateLogger('info', '{{RESPONSE}}', 'PROCESS SUCCESSFULLY EXECUTED ::: PROCESS ID ::' + configObj.process_id, 'initContentBulkUpload', data);
      resolve();
    });
  });
};

const updateUploadFailStatus = function (configObj, reason, data){
  return new Promise( async function (resolve, reject) {
    let updateSql = `UPDATE CONTENT_BULK_UPLOAD SET status = 'failed' AND failureReason='${reason}' WHERE processId = '${configObj.process_id}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT_BULK_UPLOAD DB QUERY ::: ' + updateSql, 'DB QUERY', data);
    pool.query(updateSql, function (err, results) {
      if (err) {
        logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT BULK UPLOAD STATUS ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      };
      logger.generateLogger('info', '{{RESPONSE}}', 'UPDATED CONTENT_BULK_UPLOAD DB TABLE WITH THE FAILED STATUS', 'initContentBulkUpload', data);
      resolve();
    });
  });
}

const insertContentInfoReq = function(configObj, key, data) {
  return new Promise(function (resolve, reject) {
    var strtDt = validatorUtil.getMomentDateTime(),
    endDt = validatorUtil.getMomentDateTime(),
    cName = key['strContentName'],
    cDesc = key['strContentDesc'],
    attributions = key['strAttributions'],
    keywrds = key['strKeywords'];

  (cName != undefined) ? cName = cName.replace(/'/g, "\\'") : cName = "";
  (cDesc != undefined) ? cDesc = cDesc.replace(/'/g, "\\'") : cDesc = "";

  let temp = {
    RecordSequenceNo: `${ uuidV1()}`,
    batch_processId: `${configObj.process_id}`,
    userName: `${configObj.userName}`,
    channelId:`${configObj.strChannel}`,
    startTime:`${strtDt}`,
    endTime:`${endDt}`,
    status:'pending',
    content_identifier:'',
    name:`${configObj.name}`,
    contentName:`${cName}`,
    contentDesc:`${cDesc}`,
    Board:`${key['strBoard']}`,
    Grade:`${key['strGrade']}`,
    Subject:`${key['strSubject']}`,
    Medium:`${key['strLanguage']}`,
    Topic: `${key['topic']}`,
    ResourceType:`${key['strResourceType']}`,
    keywords: `${keywrds}`,
    Audience:`${key['strAudience']}`,
    Attribution:`${attributions}`,
    IconPath:`${key['strIcon']}`,
    FilePath:`${key['strFileName']}`,
    FileFormat:`${key['strFileType']}`,
    Author: `${key['author']}`,
    Copyright:`${key['copyright']}`,
    CopyrightYear:`${key['copyrightYear']}`,
    License: `${key['license']}`,
    ContentType: `${key['contentType']}`,
    PrimaryCategory: `${key['primaryCategory']}`,
    AdditionalCategories: `${key['additionalCategories']}`,
    failure_reason:''
  }

    logger.generateLogger('info', '{{REQUEST}}', 'ADDING to CONTENT_INFO DB SQL===>' + JSON.stringify(temp), 'initContentBulkUpload', data);
    pool.query(_CONSTANTS.INSERT_TO_CONTENT_INFO,temp, function (err, result, fields) {
      if (err) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN ADDING to CONTENT_INFO DB SQL===>' + err, 'initContentBulkUpload', data);
        reject("Failed to create content info" + err);
      }
      logger.generateLogger('info', '{{RESPONSE}}', 'ADDED CONTENTS TO CONTENT_INFO DB SQL===>' + `${result.insertId}`, 'initContentBulkUpload', data);
      resolve(`${result.insertId}`);
    })
  });
}

const updateFailedContent = function (error,resultInsertId, data) {
  return new Promise( async function (resolve, reject) {
    let errs = error.toString();
    errs = errs.replace(/'/g, "\\'");
    let updtStmt = `UPDATE CONTENT_INFO SET content_identifier = '', failure_reason='${errs}', status= 'failure', endTime='${validatorUtil.getMomentDateTime()}', updatedAt='${validatorUtil.getMomentDateTime()}' WHERE id = '${resultInsertId}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
    pool.query(updtStmt, function (errors, result, fields) {
      if (errors) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING CONTENT INFO ' + JSON.stringify(errors), 'DB QUERY', data);
        reject(errors);
      }
      logger.generateLogger('error', '{{RESPONSE}}', 'UPDATED CONTENT INFO ' + JSON.stringify(result), 'DB QUERY', data);
      resolve();
    });
  });
};

const updatePassContent = function (createdata,resultInsertId,data) {
  return new Promise( async function (resolve, reject) {
    let updtStmt = "UPDATE CONTENT_INFO SET content_identifier = '" + (createdata.result.content_id ? createdata.result.content_id : createdata.result.node_id) + "', status= 'success', endTime='" + validatorUtil.getMomentDateTime() + "', updatedAt='" + validatorUtil.getMomentDateTime() + "' WHERE id = " + `${resultInsertId}`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
    pool.query(updtStmt, function (err, result, fields) {
      if (err) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING CONTENT INFO ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      }
      resolve();
    });

  });
}


//
//
//Queries for broadcast contents
//
//
const insertBroadCastUploadRequest = function(configObj,data) {
  return new Promise(async function (resolve, reject) {

    let insertSql = `INSERT INTO BROADCAST_CONTENT_UPLOAD (processId,channelId,userId,userInfo,frameworkId,excelPath,startTime,endTime,status,executor_info) VALUES ('${configObj.process_id}','${configObj.strChannel}','${configObj.strUserId}','${configObj.userName}','${configObj.strFramework}','${configObj.excelPath}','${validatorUtil.getMomentDateTime()}','${validatorUtil.getMomentDateTime()}','process','${configObj.executor_info}')`;

    logger.generateLogger("info", "{{REQUEST}}", "CREATE BROADCAST_CONTENT_UPLOAD SQL DB ENTRY=====>" + insertSql, "initContentBulkUpload", data);

    pool.query(insertSql, function (err, result, fields) {
      if (err) {
        logger.generateLogger("error", "{{RESPONSE}}", "FAILED TO CREATE BATCH PROCESS", "initContentBulkUpload", data);
        reject({
          "status": 500, "error": 'Failed to create batch process', "response": null
        });
      }
      resolve(`${result.insertId}`);
    });
  }); 
}

const updateBroadcastPassUpload = function (configObj,data) {
  return new Promise( async function (resolve, reject) {
    let updateSql = `UPDATE BROADCAST_CONTENT_UPLOAD SET status = 'completed' WHERE processId = '${configObj.process_id}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updateSql, 'DB QUERY', data);
    pool.query(updateSql, function (err, results) {
      if (err) {
        logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT BULK UPLOAD STATUS ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      };
      logger.generateLogger('info', '{{RESPONSE}}', 'PROCESS SUCCESSFULLY EXECUTED ::: PROCESS ID ::' + configObj.process_id, 'initContentBulkUpload', data);
      resolve();
    });
  });
};

const updateBroadcastUploadFailStatus = function (configObj, reason, data){
  return new Promise( async function (resolve, reject) {
    let updateSql = `UPDATE BROADCAST_CONTENT_UPLOAD SET status = 'failed' AND failureReason='${reason}' WHERE processId = '${configObj.process_id}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING BROADCAST_CONTENT_UPLOAD DB QUERY ::: ' + updateSql, 'DB QUERY', data);
    pool.query(updateSql, function (err, results) {
      if (err) {
        logger.generateLogger('info', '{{ERROR}}', 'ERROR IN UPDATING THE CONTENT BULK UPLOAD STATUS ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      };
      logger.generateLogger('info', '{{RESPONSE}}', 'UPDATED BROADCAST_CONTENT_UPLOAD DB TABLE WITH THE FAILED STATUS', 'initContentBulkUpload', data);
      resolve();
    });
  });
}

const insertBroadcastContentInfoReq = function(configObj, key, data) {
  return new Promise(function (resolve, reject) {
    var strtDt = validatorUtil.getMomentDateTime(),
    endDt = validatorUtil.getMomentDateTime(),
    cName = key['strContentName'],
    cDesc = key['strContentDesc'],
    attributions = key['strAttributions'],
    keywrds = key['strKeywords'];

  (cName != undefined) ? cName = cName.replace(/'/g, "\\'") : cName = "";
  (cDesc != undefined) ? cDesc = cDesc.replace(/'/g, "\\'") : cDesc = "";

  let temp = {
    RecordSequenceNo: `${ uuidV1()}`,
    batch_processId: `${configObj.process_id}`,
    userName: `${configObj.userName}`,
    channelId:`${configObj.strChannel}`,
    startTime:`${strtDt}`,
    endTime:`${endDt}`,
    status:'pending',
    content_identifier:'',
    name:`${configObj.name}`,
    contentName:`${cName}`,
    contentDesc:`${cDesc}`,
    Board:`${key['strBoard']}`,
    Grade:`${key['strGrade']}`,
    Subject:`${key['strSubject']}`,
    Medium:`${key['strLanguage']}`,
    Topic: `${key['topic']}`,
    ResourceType:`${key['strResourceType']}`,
    keywords: `${keywrds}`,
    Audience:`${key['strAudience']}`,
    Attribution:`${attributions}`,
    IconPath:`${key['strIcon']}`,
    FilePath:`${key['strFileName']}`,
    FileFormat:`${key['strFileType']}`,
    Author: `${key['author']}`,
    Copyright:`${key['copyright']}`,
    CopyrightYear:`${key['copyrightYear']}`,
    License: `${key['license']}`,
    LicenseTerms: `${key['licenseTerms']}`,
    ContentType: `${key['contentType']}`,
    failure_reason:''
  }

    logger.generateLogger('info', '{{REQUEST}}', 'ADDING to BROADCAST_CONTENT_INFO DB SQL===>' + JSON.stringify(temp), 'initContentBulkUpload', data);
    pool.query(_CONSTANTS.INSERT_TO_BROADCAST_CONTENT_INFO,temp, function (err, result, fields) {
      if (err) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN ADDING to BROADCAST_CONTENT_INFO DB SQL===>' + err, 'initContentBulkUpload', data);
        reject("Failed to create content info" + err);
      }
      logger.generateLogger('info', '{{RESPONSE}}', 'ADDED CONTENTS TO BROADCAST_CONTENT_INFO DB SQL===>' + `${result.insertId}`, 'initContentBulkUpload', data);
      resolve(`${result.insertId}`);
    })
  });
}

const updateBroadcastFailedContent = function (error,resultInsertId, data) {
  return new Promise( async function (resolve, reject) {
    let errs = error.toString();
    errs = errs.replace(/'/g, "\\'");
    let updtStmt = `UPDATE BROADCAST_CONTENT_INFO SET content_identifier = '', failure_reason='${errs}', status= 'failure', endTime='${validatorUtil.getMomentDateTime()}', updatedAt='${validatorUtil.getMomentDateTime()}' WHERE id = '${resultInsertId}'`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
    pool.query(updtStmt, function (errors, result, fields) {
      if (errors) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING CONTENT INFO ' + JSON.stringify(errors), 'DB QUERY', data);
        reject(errors);
      }
      logger.generateLogger('error', '{{RESPONSE}}', 'UPDATED CONTENT INFO ' + JSON.stringify(result), 'DB QUERY', data);
      resolve();
    });
  });
};

const updateBroadcastPassContent = function (createdata,resultInsertId,data) {
  return new Promise( async function (resolve, reject) {
    let updtStmt = "UPDATE BROADCAST_CONTENT_INFO SET content_identifier = '" + createdata.result.content_id + "', status= 'success', endTime='" + validatorUtil.getMomentDateTime() + "', updatedAt='" + validatorUtil.getMomentDateTime() + "' WHERE id = " + `${resultInsertId}`;
    logger.generateLogger('info', '{{DATA}}', 'UPDATING CONTENT INFO DB QUERY ::: ' + updtStmt, 'DB QUERY', data);
    pool.query(updtStmt, function (err, result, fields) {
      if (err) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN UPDATING CONTENT INFO ' + JSON.stringify(err), 'DB QUERY', data);
        reject(err);
      }
      resolve();
    });

  });
}

function triggerQuery(sqlStmt) {
  return new Promise(async function (resolve, reject) {
    DB.query(sqlStmt, function (err, result) {
      if (err) {
        logger.generateLogger(
          "error",
          "{{ERROR}} ===>" + JSON.stringify(err),
          "deleteTestCase",
          "ERROR IN delete api"
        );
        reject(err);
      }
      resolve(result);
    });
  });
}

function isPresent(val) {
  val != undefined ? (val = val.replace(/'/g, "\\'")) : (val = "");
  return val;
}

module.exports = {
  insertBulkUploadRequest,
  updatePassUpload,
  insertContentInfoReq,
  updateFailedContent,
  updatePassContent,
  updateUploadFailStatus,
  insertBroadCastUploadRequest,
  updateBroadcastPassUpload,
  updateBroadcastUploadFailStatus,
  insertBroadcastContentInfoReq,
  updateBroadcastFailedContent,
  updateBroadcastPassContent
};
