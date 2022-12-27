/**
 * Module dependencies.
 */
 const async = require('async');
 const path = require('path');
 const request = require('request');
 const XLSX = require('xlsx');
 const _ = require('lodash');
 const appRoot = require('app-root-path');
 const fs = require('fs');
 const uuidV1 = require('uuid/v1');
 const { performance } = require('perf_hooks');
 const logger = require('../../../utils/loggerUtil');
 var pool = require('../../../../config/database');
 var index = 0;
 var strFilePath = `${appRoot}/uploads/input/`;
 var strAssetFilePath = `${appRoot}/uploads/streamedOutput/`;
 const excelParser = require('../../parsers/excelParser.controller');
 var common = require('../../../routes/common');
 var config = common.config();
 var spawn = require('child_process').spawn;
 const formsController = require("../forms/index.controller");
 const channelController = require("../channel/index.controller");
 const validatorUtil = require("../../../utils/validatorUtil");
 const contentQueries = require("./queries");
 let errorsArr = [];
 let contentObj = {};
 var URL = require('url').URL;
 let _apiHandler = require("../../services/apiHandler");
 /**
  * Initialization Framework, exposing the
  * request and response to each other, as well as reading an excel file.
  *
  * @param {Request} req
  * @param {Response} res
  * @api public
  * 
  */

  const initShallowCopy = async (req, res) => {
    let token = req.body["refresh_token"];
    let executor_info = req.headers.userid;
    let metaInfo = JSON.parse(req.body.metaInfo),
      usrId = "",
      beginTime = performance.now(),
      data = { userId: req.body.userId, userName: metaInfo.userName };
  
    logger.generateLogger("info", "{{INITIALIZATION}}", "CONTENT SHALLOW COPY INITIALIZATION", "initContentShallowCopy", data);
  
    if (metaInfo.userId.includes("f:")) {
      let tmp = metaInfo.userId.split(":");
      usrId = tmp[tmp.length - 1];
    } else {
      usrId = metaInfo.userId;
    };
  
    logger.generateLogger("info", "{{REQUEST}}", "CONTENT SHALLOW COPY CREATOR USER ID:::" + usrId, "initContentShallowCopy", data);
  
    let configObj = {
      "process_id": uuidV1(),
      "strChannel": [metaInfo.channelId],
      "orgName": [metaInfo.orgName],
      "strUserId": usrId,
      "userToken": token,
      "strFramework": metaInfo.frameworkId,
      "excelPath": `${appRoot}/` + req.file.path,
      "userName": metaInfo.userName,
      "creatorInfo": metaInfo.creatorInfo,
      "name": metaInfo.name,
      "executor_info": executor_info
    }
    logger.generateLogger("info", "{{REQUEST}}", "CONTENT SHALLOW COPY REQUEST BODY" + JSON.stringify(configObj), "initContentShallowCopy", data);
  
    let insertResponse = await contentQueries.insertShallowCopyRequest(configObj, data);
    try {
      let selectSql = `SELECT * FROM CONTENT_SHALLOW_COPY WHERE id = ${insertResponse}`;
  
      logger.generateLogger("info", "{{REQUEST}}", "RETRIEVE CONTENT_SHALLOW_COPY SQL DB ENTRY=====>" + selectSql, "initContentShallowCopy", data);
  
      pool.query(selectSql, function (err, results, fields) {
        if (err) {
  
          logger.generateLogger("error", "{{RESPONSE}}", "COULD NOT RETRIEVE DB ENTRY AFTER CREATION", "initContentShallowCopy", data);
          res.statusCode = 500;
          return res.json({
            "status": 500, "error": 'Could not retrieve data after create', "response": null
          });
        }
  
        logger.generateLogger("info", "{{RESPONSE}}", "RETRIEVE CONTENT_SHALLOW_COPY SQL DB ENTRY=====>" + JSON.stringify(results), "initContentShallowCopy", data);
  
        res.statusCode = 200;
        return res.json({
          "status": 201, "error": null, "response": results
        });
      });
  
      logger.generateLogger("info", "{{INIT}}", "CONTENT SHALLOW COPY PROCESS BEGINS", "initContentShallowCopy", data);
  
          logger.generateLogger("info", "{{DATA}}", "EXCEL FILE PATH ===>" + configObj.excelPath, "initContentShallowCopy", data);
  
          let objs = [], ab, dataLength, excelData = excelParser.readExcelFile(configObj.excelPath, data), dbResultId;
  
          excelData.then(function (exceldata) {
            dataLength = exceldata.length;
            logger.generateLogger("info", "{{DATA}}", "EXCEL ENTRIES COUNT ===>" + dataLength, "initContentShallowCopy", data);
            index = 0;
            ab = validatorUtil.getMomentDateTime();
            validatorUtil.removeFileFromPath();
            async.eachSeries(exceldata, async function (key, callback) {
              contentObj = {};
              errorsArr = [];
              index = index + 1;
              let c_origin = key['Identifier'],
                c_board = key['Board'],
                c_medium = validatorUtil.ltrimElement(key['Medium']),
                c_grade = validatorUtil.ltrimElement(key['Class']),
                c_subject = validatorUtil.ltrimElement(key['Subject']);
  
                contentObj = {
                "strContentOrigin": _.isEmpty(c_origin) ? "" : c_origin.trim().toLowerCase(),
                "strBoard": _.isEmpty(c_board) ? "" : c_board.trim(),
                "strMedium": _.isEmpty(c_medium) ? [] : c_medium,
                "strGrade": _.isEmpty(c_grade) ? [] : c_grade,
                "strSubject": _.isEmpty(c_subject) ? [] : c_subject,
                "strResponse": '',
                "strCopyContentId": ''
              };
              
              logger.generateLogger('info', '{{CONTENT PARSING}}', '-----------------------  READ ROW NO. ' + index + '--------------------', 'readExcelFile', data);
              await contentQueries.insertShallowContentInfoReq(configObj, contentObj, data)
                .then(async function (insertC_info) {
                      await createShallowCopy(contentObj, configObj, insertC_info, data)
                        .then(async function (createdata) {
                          let resultInsertId = insertC_info;
                          validatorUtil.removeFileFromPath();
                          await contentQueries.updatePassShallowContent(createdata, resultInsertId, data)
                            .then(function (updatePassResp) {
                            }, function (procEr) {
                              callback(procEr);
                            });
                        }, async function (createContentEr) {
                          validatorUtil.removeFileFromPath();
                          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN CREATING SHALLOW COPY ::: ' + createContentEr, 'initContentShallowCopy', data);
                          if (index == dataLength) {
                            await contentQueries.updateFailedShallowContent(errorsArr, insertC_info, data)
                              .then(async function (failUpdateResp) {
                                await contentQueries.updatePassShallowCopy(configObj, data)
                                  .then(function (passUploadResp) {
                                  }, function (passUploadEr) {
                                    return callback(passUploadEr);
                                  });
                              }, function (failUpdateEr) {
                                callback(failUpdateEr);
                              });
  
                          } else {
                            await contentQueries.updateFailedShallowContent(errorsArr, insertC_info, data)
                              .then(function (failUpdateResp) {
                              }, function (failUpdateEr) {
                                callback(failUpdateEr);
                              });
                          }
                        });
                }, function (cont_insert_er) {
                  validatorUtil.removeFileFromPath();
                  return callback(cont_insert_er);
                });
            }, async function (error, result) {
              logger.generateLogger('info', '{{RESPONSE}}', 'FINAL SCRIPT UPDATE OF ALL THE CALLS ===> RESPONSE :::' + JSON.stringify(error) + ' ::: ' + JSON.stringify(result), 'initContentShallowCopy', data);
              if (error) {
                logger.generateLogger('error', '{{ERROR}}', 'ERROR IN SCRIPT UPDATE' + JSON.stringify(error), 'initContentShallowCopy', data);
              }
  
              let procComp = await contentQueries.updatePassShallowCopy(configObj, data);
              try {
                let closeTime = performance.now();
                logger.generateLogger('info', '{{RESPONSE}}', 'SUCCESSFULLY EXECUTED ::: PROCESS ID :: ' + configObj.process_id, 'initContentShallowCopy', data);
                logger.generateLogger('info', '{{RESPONSE}}', 'TOTAL TIME TAKN FOR EXECUTION IS ' + (closeTime - beginTime).toFixed(4) + ' :: milliseconds', 'initContentShallowCopy', data);
              } catch (ers) { };
            });
          }, async function (error) {
            logger.generateLogger('error', '{{ERROR}}', 'ERROR IN PARSING EXCEL DATA ::: ' + JSON.stringify(error), 'initContentShallowCopy', data);
            errorsArr.push(JSON.stringify(error));
            await contentQueries.updateShallowCopyFailStatus(configObj, JSON.stringify(error), data)
              .then(function (excelParseErResp) {
  
              }, function (excelParseEr) {
  
              })
          });
    } catch (insertEr) {
      res.statusCode = 500;
      return res.json(insertEr);
    };
  };

  let createShallowCopy = async function (contentObj, configObj, db_id, data) {
    return new Promise(async function (resolve, reject) {
      logger.generateLogger('info', '{{DATA}}', 'CREATE SHALLOW CONTENT::: CONTENT OBJECT===>' + JSON.stringify(contentObj), 'createShallowContent', data);
      
      await _apiHandler.createShallowContent(contentObj, configObj, data)
        .then(async function (createData) {
          logger.generateLogger('info', '{{RESPONSE}}', 'SHALLOW CONTENT CREATED SUCCESSFULLY:::' + createData + 'PUBLISH STATUS:::' + createData.publishStatus , 'createShallowContent', data);
            resolve(createData)             
        }, async function (error) {
          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN CREATING SHALLOW COPY :::' + JSON.stringify(error), 'createShallowContent', data);
          errorsArr.push(error);
          reject(error);
        });
    });
  };

module.exports = { initShallowCopy };