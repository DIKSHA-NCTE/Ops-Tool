

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

const getDashboardData = async (req, res) => {
  let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };

  let userInfo = await queries.fetchSingleSupportUser(data, data);
  let contentInfo = await getDBResponse(_constants.GET_CONTENT_INFO_DATA, 'success', data);
  let content_bulk_upload = await getDBResponse(_constants.GET_CONTENT_BULK_UPLOAD_DATA, 'completed', data);
  let broadcast_contentInfo = await getDBResponse(_constants.GET_BROADCAST_CONTENTS_INFO_DATA, 'success', data);
  let user_bulk_upload = await getDBResponse(_constants.GET_USER_BULK_UPLOAD_DATA, 'success', data);

  const roleQueries = [];
  userInfo[0]['roles'].trim().split(',').forEach(role => {
      roleQueries.push(`${role.trim()}`);
  });

  let modulesList = await getDBResponse(_constants.GET_MODULES_BY_ROLES + `'${roleQueries.join('|')}' AND isAdminModule = false AND isRootModule = true AND is_deleted = false ORDER BY name ASC`, '', data);
  let adminModules = [];
  if (userInfo[0]['roles'].includes('SUPPORT ADMIN')) {
    adminModules = await getDBResponse(_constants.GET_MODULES_BY_ROLES + `'SUPPORT ADMIN' AND isAdminModule = true AND isRootModule = true AND is_deleted = false ORDER BY name ASC`, '', data);
  }

  try {
    res.statusCode = 200;
    return res.json({
      "status": 200, "responseCode": "OK", "result": [
        { key: "Contents Created", value: contentInfo[0]['COUNT'].toLocaleString() },
        { key: "Content Bulk Uploads", value: content_bulk_upload[0]['COUNT'].toLocaleString() },
        { key: "User Bulk Uploads", value: user_bulk_upload[0]['COUNT'].toLocaleString() },
        { key: "Broadcast Contents Created", value: broadcast_contentInfo[0]['COUNT'].toLocaleString() }
      ],
      "modules": modulesList,
      "adminModules": adminModules
    });
  } catch (er) {
    res.statusCode = 500;
    return res.json({
      "status": 500, "error": 'Unable to retrieve the dashboard data', "response": null
    });
  }

}

const getDBResponse = function (query, value, data) {
  return new Promise(function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}}", "DB Request =====> " + query + ":::::" + value, "getDashboardData", data);
    pool.query(query, value, function (err, results, fields) {
      if (err) {
        logger.generateLogger("error", "{{ERROR}}", "COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + value, "getDashboardData", data);
        reject("COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + value);
      }

      logger.generateLogger("info", "{{RESPONSE}}", "RETRIEVED DB VALUE =====>" + JSON.stringify(results), "getDashboardData", data);
      resolve(results);
    });
  })
}

module.exports = { getDashboardData }