

const express = require("express");
const async = require("async");
const http = require("http");
const https = require("https");
const path = require("path");
const request = require("request");
const _ = require("lodash");
const { performance } = require("perf_hooks");
var common = require("../../../routes/common");
var config = common.config();
const logger = require("../../../utils/loggerUtil");
const fs = require("fs");
var moment = require("moment");
const appRoot = require('app-root-path');
var pool = require('../../../../config/database');
var _constants = require('../../../../config/constants');
var queries = require('../../../utils/queries');

const getSubModulesData = async (req, res) => {
  let reqBody = req.body.request.body
  let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };

  let userInfo = await queries.fetchSingleSupportUser(data, data);

  const roleQueries = [];
  userInfo[0]['roles'].trim().split(',').forEach(role => {
      roleQueries.push(`${role.trim()}`);
  });

  let subModulesList = await getDBResponse(_constants.GET_SUB_MODULES + `'${roleQueries.join('|')}' AND isAdminModule = false AND isRootModule = false AND is_deleted = false AND isVisible = true`, [reqBody.id], data);

  try {
    res.statusCode = 200;
    return res.json({
      "status": 200, "responseCode": "OK",
      "subModules": subModulesList
    });
  } catch (er) {
    res.statusCode = 500;
    return res.json({
      "status": 500, "error": 'Unable to retrieve submodules data', "response": null
    });
  }

}

const getDBResponse = function (query, value, data) {
  return new Promise(function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "DB Request =====> " + query + ":::::" + value, "getSubmodulesData", data);
    pool.query(query, value, function (err, results, fields) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + value, "getSubmodulesData", data);
        reject("COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + value);
      }

      logger.generateLogger("info", "{{RESPONSE}}", "RETRIEVED DB VALUE =====>" + JSON.stringify(results), "getSubmodulesData", data);
      resolve(results);
    });
  })
}

module.exports = { getSubModulesData }