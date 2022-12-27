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
const googleDrive = require('../../../utils/google-driver');
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
var URL = require('url').URL;
let _apiHandler = require("../../services/apiHandler");
let dropboxdriver = require("../../../utils/dropbox-driver");
let licensetermsDefaultValue = "", licenseYoutubeTermsValue = "", contentObj = {}, primaryCategoryValues = [];
/**
 * Initialization Framework, exposing the
 * request and response to each other, as well as reading an excel file.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 * 
 */

const initContentBulkUpload = async (req, res) => {
  let executor_info = req.headers.userid;
  let metaInfo = JSON.parse(req.body.metaInfo),
    usrId = "",
    beginTime = performance.now(),
    data = { userId: req.body.userId, userName: metaInfo.userName };

  logger.generateLogger("info", "{{INITIALIZATION}}", "CONTENT BULK UPLOAD INITIALIZATION", "initContentBulkUpload", data);

  if (metaInfo.userId.includes("f:")) {
    let tmp = metaInfo.userId.split(":");
    usrId = tmp[tmp.length - 1];
  } else {
    usrId = metaInfo.userId;
  };

  logger.generateLogger("info", "{{REQUEST}}", "CONTENT BULK UPLOAD CREATOR USER ID:::" + usrId, "initContentBulkUpload", data);

  let configObj = {
    "process_id": uuidV1(),
    "strChannel": metaInfo.channelId,
    "orgName": metaInfo.orgName,
    "strUserId": usrId,
    "userToken": req.body["access_token"],
    "strOrgId": metaInfo.channelId,
    "strFramework": metaInfo.frameworkId,
    "excelPath": `${appRoot}/` + req.file.path,
    "userName": metaInfo.userName,
    "creatorInfo": metaInfo.creatorInfo,
    "name": metaInfo.name,
    "executor_info": executor_info
  }

  logger.generateLogger("info", "{{REQUEST}}", "CONTENT BULK UPLOAD REQUEST BODY" + JSON.stringify(configObj), "initContentBulkUpload", data);

  let insertResponse = await contentQueries.insertBulkUploadRequest(configObj, data);
  try {
    let selectSql = `SELECT * FROM CONTENT_BULK_UPLOAD WHERE id = ${insertResponse}`;

    logger.generateLogger("info", "{{REQUEST}}", "RETRIEVE CONTENT_BULK_UPLOAD SQL DB ENTRY=====>" + selectSql, "initContentBulkUpload", data);

    pool.query(selectSql, function (err, results, fields) {
      if (err) {

        logger.generateLogger("error", "{{RESPONSE}}", "COULD NOT RETRIEVE DB ENTRY AFTER CREATION", "initContentBulkUpload", data);
        res.statusCode = 500;
        return res.json({
          "status": 500, "error": 'Could not retrieve data after create', "response": null
        });
      }

      logger.generateLogger("info", "{{RESPONSE}}", "RETRIEVE CONTENT_BULK_UPLOAD SQL DB ENTRY=====>" + JSON.stringify(results), "initContentBulkUpload", data);

      res.statusCode = 200;
      return res.json({
        "status": 201, "error": null, "response": results
      });
    });

    logger.generateLogger("info", "{{INIT}}", "CONTENT BULK UPLOAD PROCESS BEGINS", "initContentBulkUpload", data);

    let formReq =
    {
      "request":
      {
        "type": "content",
        "subType": "resource",
        "action": "review",
        "component": "*",
        "framework": configObj.strFramework,
        "rootOrgId": configObj.strOrgId
      }
    };
    logger.generateLogger("info", "{{REQUEST}}", "FORM READ REQUEST" + JSON.stringify(formReq), "initContentBulkUpload", data);

    let formResponse = await formsController.getFormData(formReq, data);
    if (formResponse.responseCode == 'OK') {
      logger.generateLogger("info", "{{RESPONSE}}", "FORM READ RESPONSE RECEIVED", "initContentBulkUpload", data);
      let formFields = formResponse.result.form.data.fields, formFieldValues = [];
      for (var i = 0; i < formFields.length; i++) {
        formFieldValues.push(formFields[i].code);
        if (formFields[i].code == 'licenseterms') {
          licensetermsDefaultValue = formFields[i].defaultValue;
          licenseYoutubeTermsValue = formFields[i].renderingHints.value['video/x-youtube'];
        }
      }

      logger.generateLogger("info", "{{DATA}}", "FORM FIELD VALUES===>" + JSON.stringify(formFieldValues), "initContentBulkUpload", data);

      let channelReq = {
        id: configObj.strChannel,
        token: configObj.userToken
      }
      let channelResponse = await channelController.readChannel(channelReq, data);
      if (channelResponse.responseCode == 'OK') {
        primaryCategoryValues = channelResponse.result.channel.contentPrimaryCategories;

        logger.generateLogger("info", "{{DATA}}", "EXCEL FILE PATH ===>" + configObj.excelPath, "initContentBulkUpload", data);

        let objs = [], ab, dataLength, excelData = excelParser.readExcelFile(configObj.excelPath, data), dbResultId;

        excelData.then(function (exceldata) {
          dataLength = exceldata.length;
          logger.generateLogger("info", "{{DATA}}", "EXCEL ENTRIES COUNT ===>" + dataLength, "initContentBulkUpload", data);
          index = 0;
          ab = validatorUtil.getMomentDateTime();
          validatorUtil.removeFileFromPath();
          async.eachSeries(exceldata, async function (key, callback) {
            console.log("**********************************************************");
            console.log("**********************************************************");
            console.log("**********************************************************");
            console.log("**********************************************************");
            console.log("**********************************************************");
            contentObj = {};
            errorsArr = [];
            index = index + 1;
            let c_name = key['Name of the Content'],
              c_desc = key['Description of the content in one line – telling about the content'],
              c_board = key['Board'],
              c_medium = validatorUtil.ltrimElement(key['Medium']),
              c_grade = validatorUtil.ltrimElement(key['Class']),
              c_subject = validatorUtil.ltrimElement(key['Subject']),
              c_topic = key['Topic'],
              c_resource = key['Resource Type'],
              c_audience = key['Audience'],
              c_icon = key['Icon'],
              c_format = key['File Format'],
              c_file = key['File Path'],
              c_author = key['Author'],
              c_copyright = key['Copyright'],
              c_cyear = key['Year of creation'],
              c_contentType = key['Content Type'],
              c_license = key['License'],
              c_licenseTerms = key['License Terms'],
              c_primaryCategory = key['Primary Category'],
              c_additionalCategories = validatorUtil.ltrimElement(key['Additional Categories']),
              c_attribution = validatorUtil.ltrimElement(key['Attribution (Credits)']), 
              c_keywords = validatorUtil.ltrimElement(key['Additional Tags / Keywords']);

            contentObj = {
              "strContentName": _.isEmpty(c_name) ? "" : c_name.trim(),
              "strContentDesc": _.isEmpty(c_desc) ? "" : c_desc.trim(),
              "strBoard": _.isEmpty(c_board) ? "" : c_board.trim(),
              "strLanguage": _.isEmpty(c_medium) ? [] : c_medium,
              "strGrade": _.isEmpty(c_grade) ? [] : c_grade,
              "strSubject": _.isEmpty(c_subject) ? [] : c_subject,
              "topic": _.isEmpty(c_topic) ? [] : c_topic.split(),
              "strResourceType": _.isEmpty(c_resource) ? "" : c_resource.trim(),
              "strKeywords": _.isEmpty(c_keywords) ? [] : c_keywords,
              "strAudience": _.isEmpty(c_audience) ? [] : c_audience.trim(),
              "strAttributions": _.isEmpty(c_attribution) ? [] : c_attribution,
              "strIcon": _.isEmpty(c_icon) ? "" : c_icon.trim(),
              "strFileType": _.isEmpty(c_format) ? "" : c_format.trim(),
              "strFileName": _.isEmpty(c_file) ? "" : c_file.trim(),
              "author": _.isEmpty(c_author) ? "" : c_author.trim(),
              "copyright": _.isEmpty(c_copyright) ? "" : c_copyright.trim(),
              "copyrightYear": _.isEmpty(c_cyear) ? "" : parseInt(c_cyear),
              "contentType": _.isEmpty(c_contentType) ? "Resource" : c_contentType.trim(),
              "primaryCategory": _.isEmpty(c_primaryCategory) ? "" : c_primaryCategory.trim(),
              "additionalCategories": _.isEmpty(c_additionalCategories)? [] : c_additionalCategories,
              "license": _.isEmpty(c_license) ? "CC BY 4.0" : c_license.trim(),
              "licenseTerms": _.isEmpty(c_licenseTerms) ? c_format == 'video/x-youtube' ? licenseYoutubeTermsValue : licensetermsDefaultValue : c_licenseTerms.trim(),
              "strExtContentId": '',
              "strConcepts": '',
              "strResponse": '',
              "strMimeType": '',
              "strContentId": ''
            };
            logger.generateLogger('info', '{{CONTENT PARSING}}', '-----------------------  READ ROW NO. ' + index + '--------------------', 'readExcelFile', data);
            await contentQueries.insertContentInfoReq(configObj, contentObj, data)
              .then(async function (insertC_info) {
                await validatorUtil.validateFormFields(key, formFields, primaryCategoryValues)
                  .then(async function (validateResponse) {
                    logger.generateLogger('info', '{{RESPONSE}}', 'VALIDATE RESPONSE FORM FIELDS ===>' + validateResponse, 'initContentBulkUpload', data);
                    await createContent(contentObj, configObj, insertC_info, formFieldValues, data)
                      .then(async function (createdata) {
                        let resultInsertId = insertC_info;
                        validatorUtil.removeFileFromPath();
                        await contentQueries.updatePassContent(createdata, resultInsertId, data)
                          .then(function (updatePassResp) {
                          }, function (procEr) {
                            callback(procEr);
                          });
                      }, async function (createContentEr) {
                        validatorUtil.removeFileFromPath();
                        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN CREATING CONTENTS ::: ' + createContentEr, 'initContentBulkUpload', data);
                        if (index == dataLength) {
                          await contentQueries.updateFailedContent(errorsArr, insertC_info, data)
                            .then(async function (failUpdateResp) {
                              await contentQueries.updatePassUpload(configObj, data)
                                .then(function (passUploadResp) {
                                }, function (passUploadEr) {
                                  return callback(passUploadEr);
                                });
                            }, function (failUpdateEr) {
                              callback(failUpdateEr);
                            });

                        } else {
                          await contentQueries.updateFailedContent(errorsArr, insertC_info, data)
                            .then(function (failUpdateResp) {
                            }, function (failUpdateEr) {
                              callback(failUpdateEr);
                            });
                        }
                      });
                  }, async function (validateResponseErs) {
                    errorsArr.push(validateResponseErs)
                    await contentQueries.updateFailedContent(errorsArr, insertC_info, data)
                      .then(function (failUpdateResp) {
                      }, function (failer) {
                        callback(failer);
                      });
                  })
              }, function (cont_insert_er) {
                validatorUtil.removeFileFromPath();
                return callback(cont_insert_er);
              });
          }, async function (error, result) {
            logger.generateLogger('info', '{{RESPONSE}}', 'FINAL SCRIPT UPDATE OF ALL THE CALLS ===> RESPONSE :::' + JSON.stringify(error) + ' ::: ' + JSON.stringify(result), 'initContentBulkUpload', data);
            if (error) {
              logger.generateLogger('error', '{{ERROR}}', 'ERROR IN SCRIPT UPDATE' + JSON.stringify(error), 'initContentBulkUpload', data);
            }

            let procComp = await contentQueries.updatePassUpload(configObj, data);
            try {
              let closeTime = performance.now();
              logger.generateLogger('info', '{{RESPONSE}}', 'SUCCESSFULLY EXECUTED ::: PROCESS ID :: ' + configObj.process_id, 'initContentBulkUpload', data);
              logger.generateLogger('info', '{{RESPONSE}}', 'TOTAL TIME TAKN FOR EXECUTION IS ' + (closeTime - beginTime).toFixed(4) + ' :: milliseconds', 'initContentBulkUpload', data);
            } catch (ers) { };
          });
        }, async function (error) {
          logger.generateLogger('error', '{{ERROR}}', 'ERROR IN PARSING EXCEL DATA ::: ' + JSON.stringify(error), 'initContentBulkUpload', data);
          errorsArr.push(JSON.stringify(error));
          await contentQueries.updateUploadFailStatus(configObj, JSON.stringify(error), data)
            .then(function (excelParseErResp) {

            }, function (excelParseEr) {

            })
        });
      }else{
        logger.generateLogger("error", "{{RESPONSE}}", "CHANNEL READ RESPONSE ERROR" + JSON.stringify(channelResponse), "initContentBulkUpload", data);
        errorsArr.push("CHANNEL READ RESPONSE ERROR" + JSON.stringify(channelResponse));
        await contentQueries.updateUploadFailStatus(configObj, JSON.stringify(channelResponse), data)
          .then(function (excelParseErResp) {

          }, function (excelParseEr) {

          })
      }
    } else {
      logger.generateLogger("error", "{{RESPONSE}}", "FORM READ RESPONSE ERROR" + JSON.stringify(formResponse), "initContentBulkUpload", data);
      errorsArr.push("FORM READ RESPONSE ERROR" + JSON.stringify(formResponse));
      await contentQueries.updateUploadFailStatus(configObj, JSON.stringify(formResponse), data)
        .then(function (excelParseErResp) {

        }, function (excelParseEr) {

        })
    }
  } catch (insertEr) {
    res.statusCode = 500;
    return res.json(insertEr);
  };
};

let createContent = async function (contentObj, configObj, db_id, formFieldValues, data) {
  return new Promise(async function (resolve, reject) {
    logger.generateLogger('info', '{{DATA}}', 'CREATE CONTENT::: CONTENT OBJECT===>' + JSON.stringify(contentObj), 'createContent', data);
    logger.generateLogger('info', '{{DATA}}', 'VALIDATING FILE PATH', 'validatorUtil.ValidateDriveUrl', data);
    await googleDriveFilesProcess(contentObj, db_id, data)
      .then(async function (gdrivedata) {
        contentObj.strIcon = gdrivedata[0]['iconName'];
        if (gdrivedata && gdrivedata[1]) {
          contentObj.strFileName = gdrivedata[1]['strFileName'];
        }

        logger.generateLogger('info', '{{RESPONSE}}', 'PARSED FILE/S FROM GOOGLE DRIVE SUCCESSFULLY===ICON:::' + contentObj.strIcon + "===FILE:::" + contentObj.strFileName, 'createContent', data);

        await validatorUtil.checkForIconFormat(contentObj.strIcon, data)
          .then(async function (res) {
            logger.generateLogger('info', '{{RESPONSE}}', 'ICON FORMAT PARSED SUCCESSFULLY :::VALID ICON FORMAT', 'checkForIconFormat', data);

            let strFileType = contentObj.strFileType,
              strFileName = contentObj.strFileName;

            if (_.includes(strFileType, "YouTube") || _.includes(strFileType, "Youtube")) {
              await processYoutubeContents(strFileName, contentObj, configObj, formFieldValues, data)
                .then(async function (youtubeContResp) {
                  resolve(youtubeContResp);
                }, async function (youtubeContEr) {
                  logger.generateLogger('error', '{{ERROR}}', 'ERROR IN PROCESSING YOUTUBE CONTENTS :::' + JSON.stringify(youtubeContEr), 'processYoutubeContents', data);
                  errorsArr.push(youtubeContEr);
                  reject(youtubeContEr);
                });
            } else {
              validatorUtil.checkContentFileSize(contentObj.strFileName, data)
                .then(async function (rs) {
                  await processNonYoutubeContents(contentObj.strFileType, contentObj.strFileName, contentObj, configObj, formFieldValues, data)
                    .then(async function (processedResponse) {
                      resolve(processedResponse);
                    }, async function (processedEr) {
                      logger.generateLogger('error', '{{ERROR}}', 'ERROR IN PROCESSING NON YOUTUBE CONTENTS :::' + JSON.stringify(processedEr), 'processYoutubeContents', data);
                      errorsArr.push(processedEr);
                      reject(processedEr);
                    });
                }, async function (filesizeError) {
                  logger.generateLogger("error", "{{ERROR}}", "CONTENT FILE SIZE ERROR :::" + filesizeError, "createContent", data);
                  errorsArr.push(filesizeError);
                  reject(filesizeError);
                });
            }
          }, async function (IconFormatErr) {
            errorsArr.push(IconFormatErr);
            logger.generateLogger('error', '{{ERROR}}', 'ICON FORMAT MISMATCH :::' + JSON.stringify(IconFormatErr), 'checkForIconFormat', data);
            reject(IconFormatErr);
          });
      }, async function (gDriveProcEr) {
        logger.generateLogger('error', '{{ERROR}}', 'ERROR IN PROCESSING GOOGLE DRIVE FILE :::' + JSON.stringify(gDriveProcEr), 'googleDriveFilesProcess', data);
        errorsArr.push(gDriveProcEr);
        reject(gDriveProcEr);
      });
  });
};

let googleDriveFilesProcess = async function (contentObj, db_id, data) {
  let strIcon = contentObj.strIcon;
  let strFile = contentObj.strFileName;
  let strFormat = contentObj.strFileType;
  return new Promise(async function (resolve, reject) {
    if (!_.isEmpty(strIcon) && !_.isEmpty(strFile)) {
      async.waterfall([
        async.apply(downloadIcon, strIcon, strFormat, db_id, data),
        async.apply(downloadFile, strFile, strFormat, db_id, data)
      ], async function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } else {
      if (!_.isEmpty(strIcon)) {
        logger.generateLogger("error", "{{ERROR}}", "ICON PATH IS EMPTY", "googleDriveFilesProcess", data);
        reject('Icon path is empty');
      } else if (!_.isEmpty(strFile)) {
        logger.generateLogger("error", "{{ERROR}}", "FILE PATH IS EMPTY", "googleDriveFilesProcess", data);
        reject('File path is empty');
      }
    }
  });
}

let downloadYoutubeIcon = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    var a = uri.split("https://img.youtube.com/vi/");
    var b = a[1].split("/");
    var c = a[1].split(".");
    b[0], c[1];
    let fileName = b[0] + "." + c[1];
    let filePath = strFilePath + fileName;
    var dest = fs.createWriteStream(filePath);
    request(uri).pipe(fs.createWriteStream(filePath)).on('close', function () { callback(fileName) });
  });
};

let downloadThirdPartyIcon = async function (strIcon, strFileFormat, db_id, data, callback) {
  var filename = strIcon.substring(strIcon.lastIndexOf('/') + 1);
  await validatorUtil.downloadotherFiles(strIcon, filename, function (errs, res) {
    logger.generateLogger("info", "{{DATA}}", "DOWNLOADING THE GOOGLE DRIVE ICON :::" + strIcon, "downloadIcon", data);
    if (errs != null && errs.hasOwnProperty('code')) {
      if (errs.code == 404) {
        logger.generateLogger("errsor", "{{errsOR}}", "This icon file is not a part of google drive link" + res + " ::: " + strIcon, "downloadFile", data);
        errorsArr.push("This icon file " + strIcon + " is not a part of google drive link")
        return callback("This icon file is not a part of google drive link");
      }
    } else if (errs) {
      logger.generateLogger("info", "{{ERROR}}", "ERROR IN DOWNLOADING THE GOOGLE DRIVE ICON :::", "downloadIcon", data);
      errorsArr.push("Unable to download the Icon due to invalid permission or icon not found in the link");
      return callback("Unable to download the Icon due to invalid permission or icon not found in the link  ");
    }
    logger.generateLogger("info", "{{RESPONSE}}", "GOOGLE DRIVE ICON DOWNLOADED SUCCESSFULLY :::" + res, "downloadIcon", data);
    callback(null, res);
  });
};

let downloadIcon = async function (strIcon, strFileFormat, db_id, data, callback) {
  if (strFileFormat == "Dropbox") {
    // callback(null, "ttllogo.png");
          const inputFilePath = `${appRoot}/uploads/input/`;
          const OutputFilePath = `${appRoot}/uploads/streamedOutput/`;
           
    
         // await dowmloadDropboxContent(inputFilePath,strFile,DropboxFileName);
          var process = spawn('python3',["./python/down_dropbox_requests.py",inputFilePath,strIcon]); 
        process.on('close', function(code) {
          strIcon=getFilenameURL(strIcon)
          callback(null,strIcon);
       })
       process.on('error', function(err) { callback(err) })
  } else {
    await validatorUtil.getIdFromUrl(strIcon)
      .then(async function (fileId) {
        await googleDrive.downloadFiles(fileId, strFileFormat, function (errs, res) {
          logger.generateLogger("info", "{{DATA}}", "DOWNLOADING THE GOOGLE DRIVE ICON :::" + strIcon, "downloadIcon", data);
          if (errs != null && errs.hasOwnProperty('code')) {
            if (errs.code == 404) {
              logger.generateLogger("errsor", "{{errsOR}}", "This icon file is not a part of google drive link" + fileId + " ::: " + strIcon, "downloadFile", data);
              errorsArr.push("This icon file " + strIcon + " is not a part of google drive link")
              return callback("This icon file is not a part of google drive link");
            }
          } else if (errs) {
            logger.generateLogger("info", "{{ERROR}}", "ERROR IN DOWNLOADING THE GOOGLE DRIVE ICON :::", "downloadIcon", data);
            errorsArr.push("Unable to download the Icon due to invalid permission or icon not found in the link");
            return callback("Unable to download the Icon due to invalid permission or icon not found in the link  ");
          }
          logger.generateLogger("info", "{{RESPONSE}}", "GOOGLE DRIVE ICON DOWNLOADED SUCCESSFULLY :::" + res, "downloadIcon", data);
          callback(null, res);
        });
      }, function (err) {
        logger.generateLogger("error", "{{ERROR}}", "INVALID GOOGLE DRIVE ICON URL :::" + err, "downloadIcon", data);
        errorsArr.push("Invalid Google Drive Icon URL" + err);
        return callback("INVALID GOOGLE DRIVE ICON URL" + err);
      });
  }
};
function getFilenameURL(url) {
  const fileId = decodeURIComponent(new URL(url).pathname.split('/')[2]);
  let extension=decodeURIComponent(new URL(url).pathname.split('/').pop().split(".").pop());
  return `${fileId}.${extension}`;
}

let downloadFile = async function (strFile, strFileFormat, db_id, data, iconName, callback) {
  let fileNames = [];
  fileNames.push({ 'iconName': iconName });
  logger.generateLogger("info", "{{DATA}}", "FILE FORMAT OF DOWNLOADABLE FILE :::::" + strFileFormat, "downloadFile", data);
  if (_.includes(strFileFormat, "YouTube") || _.includes(strFileFormat, "Youtube")) {
    logger.generateLogger("info", "{{RESPONSE}}", "YOUTUBE FILE :::::" + JSON.stringify(fileNames), "downloadFile", data);
    callback(null, fileNames);
  } else {
    if (strFileFormat == "Dropbox") {
      //download file from dropbxo  
       const inputFilePath = `${appRoot}/uploads/input/`;
      const OutputFilePath = `${appRoot}/uploads/streamedOutput/`;
       

     // await dowmloadDropboxContent(inputFilePath,strFile,DropboxFileName);
      var process = spawn('python3',["./python/down_dropbox_requests.py",inputFilePath,strFile]); 
    process.on('close', function(code) {
      console.log(code);
      
      strFile=getFilenameURL(strFile)
       var args = [
                '-i', inputFilePath + strFile,
                '-c', 'copy',
                '-movflags', '+faststart',
                OutputFilePath + strFile
              ];

              var proc = spawn('ffmpeg', args);
              logger.generateLogger("info", "{{DATA}}", "CONVERSION OF VIDEO FILE TO PROPER FORMAT USING FFMPEG BEGINS", "FFMPEG", data);
              proc.stdout.on('data', function (data) {
                console.log(data);
              });

              proc.stderr.on('data', function (data) {
                console.log(data);
              });

              proc.on('close', function () {
                logger.generateLogger("info", "{{RESPONSE}}", "CONVERTED VIDEO FILE TO PROPER FORMAT" + strFile, "FFMPEG", data);
                fileNames.push({ 'strFileName': strFile });
                callback(null, fileNames);
              }); 
   })
   process.on('error', function(err) { callback(err) })
  
    } else {
      let fileId = validatorUtil.getIdFromUrl(strFile)
        .then(async function (fileId) {
          logger.generateLogger("info", "{{DATA}}", "GOOGLE DRIVE FILE ID :::::" + fileId, "downloadFile", data);
          await googleDrive.downloadFiles(fileId, strFileFormat, function (err, res) {
            if (err != null && err.hasOwnProperty('code')) {
              if (err.code == 404) {
                logger.generateLogger("error", "{{ERROR}}", "This file is not a part of google drive link" + fileId + " ::: " + strFile, "downloadFile", data);
                errorsArr.push("This file " + strFile + " is not a part of google drive link")
                return callback("This file is not a part of google drive link");
              }
            } else if (err) {
              logger.generateLogger("error", "{{ERROR}}", "Unable to download the File from Google Drive" + fileId + "due to invalid permission or icon not found in the link ::: " + strFile, "downloadFile", data);
              errorsArr.push("Unable to download this file content " + strFile + " from the google drive due to invalid permission or icon not found in the link");
              return callback("Unable to download the File from Google Drive due to invalid permission or icon not found in the link");
            }
            const inputFilePath = `${appRoot}/uploads/input/`;
            const OutputFilePath = `${appRoot}/uploads/streamedOutput/`;

            if (strFileFormat == "Video (mp4 and webM)") {
              var args = [
                '-i', inputFilePath + res,
                '-c', 'copy',
                '-movflags', '+faststart',
                OutputFilePath + res
              ];

              var proc = spawn('ffmpeg', args);
              logger.generateLogger("info", "{{DATA}}", "CONVERSION OF VIDEO FILE TO PROPER FORMAT USING FFMPEG BEGINS", "FFMPEG", data);
              proc.stdout.on('data', function (data) {
                console.log(data);
              });

              proc.stderr.on('data', function (data) {
                console.log(data);
              });

              proc.on('close', function () {
                logger.generateLogger("info", "{{RESPONSE}}", "CONVERTED VIDEO FILE TO PROPER FORMAT" + res, "FFMPEG", data);
                fileNames.push({ 'strFileName': res });
                callback(null, fileNames);
              });
            } else {

              console.log("before copying");
              let a = fs.createReadStream(inputFilePath + res)
              let b = fs.createWriteStream(OutputFilePath + res);
              a.pipe(b);
              // .on('end',function(){ 
              //   console.log("File processed");
              //   logger.generateLogger("info", "{{RESPONSE}}", "COPIED NON VIDEO FILE FROM SOURCE TO DESTINATION", "FFMPEG", data);
              //   fileNames.push({ 'strFileName': res });
              //   callback(null, fileNames);
              // })
              // .on('error',function(err) {
              //   logger.generateLogger("error","{{ERROR}}","File copying error",err,data);
              //   callback(err);
              //  });
              // fs.copyFile(inputFilePath + res, OutputFilePath + res, (err) => {
              //   if (err) throw err;
              //   logger.generateLogger("info", "{{RESPONSE}}", "COPIED NON VIDEO FILE FROM SOURCE TO DESTINATION", "FFMPEG", data);
              // var stats = fs.statSync(inputFilePath + res), statsOp = fs.statSync(OutputFilePath + res);
              // console.log(stats['size'], statsOp['size']);
              fileNames.push({ 'strFileName': res });
              callback(null, fileNames);
              // });

            }
          });
        }, function (err) {
          logger.generateLogger("error", "{{ERROR}}", "INVALID GOOGLE DRIVE FILE URL :::" + err, "downloadFile", data);
          errorsArr.push("Invalid Google Drive FILE URL" + err);
          return callback("INVALID GOOGLE DRIVE FILE URL" + err);
        });
    }
  }
}

let processYoutubeContents = async function (strFileName, contentObj, configObj, formFieldValues, data) {
  if (_.includes(strFileName, "www.youtube.com/watch?v=")) {
    var iIndex = strFileName.indexOf("=");
    var iEndIndex = strFileName.indexOf("&");
    if (iEndIndex != -1)
      contentObj.strExtContentId = strFileName.substring(iIndex + 1, iEndIndex);
    else
      contentObj.strExtContentId = strFileName.substring(iIndex + 1);
  } else if (_.includes(strFileName, "https://www.youtube.com/watch?time_continue=")) {
    var a = strFileName.split("&v=");
    contentObj.strExtContentId = a[1];
  } else if (_.includes(strFileName, "youtu.be/")) {
    var iIndex = strFileName.lastIndexOf("/");
    contentObj.strExtContentId = strFileName.substring(iIndex + 1);
  } else {
    contentObj.strExtContentId = strFileName;
  }

  contentObj.strMimeType = "video/x-youtube";
  return new Promise(async function (resolve, reject) {
    _apiHandler.createYoutubeContent(contentObj, configObj, formFieldValues, data)
      .then(function (response) {
        let strContentId = response;
        logger.generateLogger('info', '{{RESPONSE}}', 'YoutubeContentUpload --> strContentResponse :: ' + JSON.stringify(strContentId), 'createYoutubeContent', data);
        logger.generateLogger('info', '{{RESPONSE}}', 'In  YoutubeContentUpload --> strContentId :: ' + strContentId, 'checkForIconFormat', data);
        contentObj.strContentId = strContentId;
        _apiHandler.createThumbImage(contentObj, configObj, data)
          .then(async function (res) {
            resolve(res);
          }, async function (imageerror) {
            reject(imageerror);
          }
          );
      }, async function (YoutubeError) {
        reject(YoutubeError);
      }
      );
  });
};

let processNonYoutubeContents = async function (strFileType, strFileName, contentObj, configObj, formFieldValues, data) {
  return new Promise(async function (resolve, reject) {
    let isZip = false;
    console.log(strFileType, _.isEqual(strFileType, "Dropbox"));
    if (_.isEqual(_.toUpper(strFileType), "PDF")) {
      if (!_.includes(strFileName, "pdf") && !_.includes(strFileName, "PDF")) {
        strFileName = strFileName + ".pdf";
      }
      contentObj.strMimeType = "application/pdf";
    } else if (_.isEqual(_.toUpper(strFileType), "HTML")) {
      contentObj.strMimeType = "application/vnd.ekstep.html-archive";
      isZip = true;
    } else if (_.isEqual(_.toUpper(strFileType), "EPUB")) {
      contentObj.strMimeType = "application/epub";
    } else if (_.includes(strFileType, "Video (mp4 and webM)")) {
      var iExt = strFileName.lastIndexOf(".");
      var strVideoType = strFileName.substring(iExt + 1);
      if (_.isEqual(strVideoType, "mp4")) {
        contentObj.strMimeType = "video/mp4";
      }
      else if (_.isEqual(strVideoType, "webm")) {
        contentObj.strMimeType = "video/webm";
      } else {
        logger.generateLogger('error', '{{ERROR}}', 'Invalid video format :: " + strVideoType + " :::: for content: ' + contentObj.strContentName, 'checkContentFileSize', data);
        reject("Invalid video format. The format is " + strVideoType + " but it has to be either .mp4 or .webm");
      }
    } else if (_.isEqual(_.toUpper(strFileType), "H5P")) {
      contentObj.strMimeType = "application/vnd.ekstep.h5p-archive";
    } else if (_.isEqual(strFileType, "Dropbox")) {
      contentObj.strMimeType = "video/mp4";
    }
    console.log(contentObj.strMimeType);

    await TriggerAsyncWaterFallProcess(strFilePath, contentObj, configObj, isZip, formFieldValues, data)
      .then(async function (waterfallResp) {
        resolve(waterfallResp);
      }, async function (waterFallEr) {
        reject(waterFallEr);
      });
  });
};

let TriggerAsyncWaterFallProcess = async function (strFilePath, contentObj, configObj, isZip, formFieldValues, data) {
  return new Promise(async function (resolve, reject) {
    contentAsycProcess(strFilePath, contentObj, configObj, isZip, formFieldValues, data, async function (error, response) {
      if (error) {
        reject(error);
      }
      let obj = {
        result: {
          content_id: response
        }
      };
      resolve(obj);
    });
  });
};

let contentAsycProcess = function (filePath, contentObj, configObj, isZip = false, formFieldValues, data, outerCallback) {
  async.waterfall([
    function (callback) {
      _apiHandler.createDefaultContent(contentObj, configObj, formFieldValues, data)
        .then(function (response) {
          let strContentId = response;
          contentObj.strContentId = strContentId;
          logger.generateLogger("info", "{{DATA}}", "CONTENT UPLOAD ::::: CONTENT CREATED ::: CONTENT ID " + strContentId, "createDefaultContent", data);
          callback(null, strContentId);
        }, function (error) {
          callback(error);
        });
    },
    function (contentID, callback) {
      _apiHandler.getPreSignedURL(contentID, contentObj.strFileName, configObj, data)
        .then(function (response) {
          logger.generateLogger("info", "{{DATA}}", "CONTENT UPLOAD ::::: PRESIGNED URL " + response, "getPreSignedURL", data);
          var index = _.indexOf(response, "?");
          var strAssetBaseUrl = response.substring(0, index);
          logger.generateLogger("info", "{{DATA}}", "CONTENT UPLOAD ::::: ASSET BASE URL " + strAssetBaseUrl, "getPreSignedURL", data);
          var url = response;
          var file = strAssetFilePath + contentObj.strFileName;
          callback(null, url, file, strAssetBaseUrl)
        }, function (error) {
          callback(error);
        });
    },
    function (url, file, strAssetBaseUrl, callback) {
      if (isZip) {
        contentObj.strMimeType = "application/zip";
      }
      _apiHandler.uploadFileToS3SinglePUT(url, file, contentObj.strMimeType, data)
        .then(function (res) {
          callback(null, strAssetBaseUrl);
        }, function (error) {
          callback(error);
        });
    },
    function (strAssetBaseUrl, callback) {
      _apiHandler.uploadToContent(strAssetBaseUrl, contentObj.strContentId, configObj, data)
        .then(function (res) {
          callback(null, res);
        }, function (error) {
          callback(error);
        });
    },
    function (res, callback) {
      _apiHandler.createThumbImage(contentObj, configObj, data)
        .then(function (res) {
          callback(null, contentObj.strContentId);
        }, function (error) {
          callback(error)
        });
    },
  ], function (err, result) {
    if (err) {
      outerCallback(err);
    } else {
      outerCallback(null, result);
    }
  });
}

module.exports = { initContentBulkUpload };