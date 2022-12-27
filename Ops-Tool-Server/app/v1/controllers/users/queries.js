const _ = require("lodash");
const async = require("async");
var DB = require("../../../../config/database");
var logger = require("../../../utils/loggerUtil");
const validatorUtil = require("../../../utils/validatorUtil");
var pool = require('../../../../config/database');
const uuidV1 = require('uuid/v1');
const _CONST = require("../../../../config/constants");

const insertUserBulkRequest = function(req,data) {
  return new Promise(async function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "CREATE USER_BULK_UPLOAD SQL DB ENTRY=====>" + _CONST.USER_BULK_UPLOAD_REQUEST +"  "+ JSON.stringify(req), "initContentBulkUpload", data);
    pool.query(_CONST.USER_BULK_UPLOAD_REQUEST,req, function (err, result) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "FAILED TO CREATE BATCH PROCESS", "insertUserBulkRequest", data);
        reject({
          "status": 500, "error": 'Failed to create batch process', "response": null
        });
      }
      logger.generateLogger("info", "{{RESPONSE}}", "USER BULK UPLOAD BATCH PROCESS CREATED SUCCESSFULLY, THE ROW ID IS "+result.insertId, "insertUserBulkRequest", data);
      resolve(`${result.insertId}`);
    });
  }); 
}

const updateFailRequest = function(req,data){
  return new Promise(async function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "UPDATE USER_BULK_UPLOAD SQL DB ENTRY=====>" + _CONST.UPDATE_BULK_FAIL_REQUEST +"  "+ JSON.stringify(req), "updateFailRequest", data);
    pool.query(_CONST.UPDATE_BULK_FAIL_REQUEST,req, function (err, result) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "FAILED TO UPDATE BULK REQUEST", "updateFailRequest", data);
        reject({
          "status": 500, "error": 'FAILED TO UPDATE BULK REQUEST', "response": null
        });
      }
      logger.generateLogger("info", "{{RESPONSE}}", "USER BULK UPLOAD UPDATED SUCCESSFULLY", "updateFailRequest", data);
      resolve(`${result.insertId}`);
    });
  }); 
}

const updatePassRequest = function(req,data){
  return new Promise(async function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "UPDATE USER_BULK_UPLOAD SQL DB ENTRY=====>" + _CONST.UPDATE_BULK_PASS_REQUEST +"  "+ JSON.stringify(req), "updatePassRequest", data);
    pool.query(_CONST.UPDATE_BULK_PASS_REQUEST,req, function (err, result) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "FAILED TO UPDATE BULK REQUEST", "updatePassRequest", data);
        reject({
          "status": 500, "error": 'FAILED TO UPDATE BULK REQUEST', "response": null
        });
      }
      logger.generateLogger("info", "{{RESPONSE}}", "USER BULK UPLOAD UPDATED SUCCESSFULLY", "updatePassRequest", data);
      resolve();
    });
  }); 
}

const fetchEntryFromDB = function(req,data) {
  return new Promise(async function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "fetch USER_BULK_UPLOAD SQL DB ENTRY=====>" + _CONST.FETCH_DB_ROW +"  "+ JSON.stringify(req), "fetchEntryFromDB", data);
    pool.query(_CONST.FETCH_DB_ROW,req, function (err, result) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "FAILED TO fetch response from db", "fetchEntryFromDB", data);
        reject('Failed to fetch response from db');
      }
      logger.generateLogger("info", "{{RESPONSE}}", "USER BULK UPLOAD DATA RETRIEVED SUCCESSFULLY", "fetchEntryFromDB", data);
      resolve(result);
    });
  }); 
}

module.exports = {
    insertUserBulkRequest,
    updateFailRequest,
    updatePassRequest,
    fetchEntryFromDB
};
