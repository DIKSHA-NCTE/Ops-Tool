

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
var apiConfig = require('../../../../config/api.config.json');
const logger = require("../../../utils/loggerUtil");
const statusArr = ['Pending', 'In Progress', 'Completed'];
const fs = require("fs");
var moment = require("moment");
const { BlobServiceClient } = require("@azure/storage-blob");
const appRoot = require('app-root-path');
const Axios = require('axios');
const ProgressBar = require('progress');
var token = process.env.EXHAUSTREPORTSAS;
const account = process.env.BLOB_ACCOUNT;

const containerName = "reports";
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${token}`);
const containerClient = blobServiceClient.getContainerClient(containerName);
const strFilePath = `${appRoot}/uploads/course-reports/`;
var tenants = require("../organization/organization.controller");
var forms = require("../forms/index.controller");
var constants = require("../admin/constant.controller");

const getCoursesList = (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let options = {
        method: 'POST',
        url: config.BASE + apiConfig.APIS.COURSEBATCH,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': reqHeader.token
        },
        body: reqBody,
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "SEARCH COURSE BATCH LIST", "SEARCH COURSE BATCH LIST REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH COURSE BATCH LIST ::: " + JSON.stringify(error), "SEARCH COURSE BATCH LIST", "SEARCH COURSE BATCH LIST RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                if (body.params.status == 'success') {
                    logger.generateLogger("info", "{{SUCCESS}} ===> COURSE BATCH LIST FETCHED SUCCESSFULLY ::: NUMBER OF COURSE BATCHES ::::" + body.result.response.count, "SEARCH COURSE BATCH LIST", "SEARCH COURSE BATCH LIST RESPONSE", data);
                    let response = body.result.response.content;
                    let respArr = [];
                    if (response && response.length > 0) {
                        response.forEach(element => {

                            let temp = {
                                courseId: element.courseId,
                                courseName: element.name,
                                batchId: element.batchId,
                                createdOn: element.createdDate != null ? moment(new Date(element.createdDate)).format('DD MMM YYYY h:mm:ss A') : '---',
                                createdFor: element.createdFor && element.createdFor.length > 0 ? element.createdFor.toString() : '---',
                                channel: element.createdFor && element.createdFor.length > 0 ? element.createdFor[0].toString() : '---',
                                createdBy: element.createdBy,
                                startDate: element.startDate != null ? moment(new Date(element.startDate)).format('DD MMM YYYY') : '---',
                                enrollmentEndDate: element.enrollmentEndDate != null ? moment(new Date(element.enrollmentEndDate)).format('DD MMM YYYY') : '---',
                                enrollmentType: element.enrollmentType,
                                endDate: element.endDate != null ? moment(new Date(element.endDate)).format('DD MMM YYYY') : '---',
                                mentors: element.mentors && element.mentors.length > 0 ? element.mentors.toString() : '---',
                                status: statusArr[element.status]
                                // report_url: (element.status == 1 || element.status == 2) ? config.PROGRESS_REPORTS + "report-" + element.batchId + ".csv" : "",
                                // progress_exhaust: "progress-exhaust/" + element.batchId + "_progress_20201110.csv",
                                // userinfo_exhaust: "userinfo-exhaust/" + element.batchId + "_userinfo_20201110.csv"
                            }

                            respArr.push(temp);
                        });
                    }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": respArr
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIEVED ", "SEARCH COURSE BATCH LIST", "SEARCH COURSE BATCH LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH COURSE BATCH LIST ::: " + JSON.stringify(body), "SEARCH COURSE BATCH LIST", "SEARCH COURSE BATCH LIST RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to fetch the COURSE BATCH details",
                    "error_description": "Unable to fetch the COURSE BATCH details"
                })
            }
        }
    });
}

const downloadReport = async (req, res) => {
  let reqHeader = req.headers, userData = { userName: reqHeader.username, userId: reqHeader.userid };
  logger.generateLogger("info", "{{REQUEST}} ===>" + req.body.url, "DOWNLOAD COURSE EXHAUST REPORT", "DOWNLOAD COURSE EXHAUST REPORT REQUEST", userData);
    const downloadedFile = `${appRoot}/uploads/course-reports/${req.body.url.split("/").pop()}`;
    const lastModified = fs.existsSync(downloadedFile) ? fs.statSync(downloadedFile).mtime.toLocaleDateString("en-US", {timeZone: 'Asia/Kolkata'}) : 0;
    if(lastModified === new Date().toLocaleDateString("en-US", {timeZone: 'Asia/Kolkata'})) {
      logger.generateLogger("info", "{{SUCCESS}} ===>" + req.body.url, "DOWNLOAD COURSE EXHAUST REPORT", "COURSE EXHAUST REPORT DOWNLOADED SUCCESSFULLY", userData);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
            "statusCode": 200,
            "response": "File downloaded",
            "url": `/course-reports-reports/${req.body.url.split("/").pop()}`
            })
    } 
    else {
        if(fs.existsSync(downloadedFile)) {
            fs.unlinkSync(downloadedFile)
        }
    const blobName = req.body.url.split("/").pop();
    let url = req.body.url + token;
    console.log('Connecting …');
    const { data, headers } = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    const totalLength = headers['content-length']

    console.log('Starting download')
    const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength)
    })

    const writer = fs.createWriteStream(strFilePath + blobName);

    data.on('data', (chunk) => progressBar.tick(chunk.length))
    data.pipe(writer)
    data.on('end', () => {
      logger.generateLogger("info", "{{SUCCESS}} ===>" + req.body.url, "DOWNLOAD COURSE EXHAUST REPORT", "COURSE EXHAUST REPORT DOWNLOADED SUCCESSFULLY", userData);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 200,
            "response": "File downloaded",
            "url": '/course-reports/' + blobName
        })
    });
    data.on('error', () => {
      logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD COURSE EXHAUST REPORT ::: " + 'File does not exist', "DOWNLOAD COURSE EXHAUST REPORT", "DOWNLOAD COURSE EXHAUST REPORT RESPONSE", userData);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 400,
            "error": "File does not exist"
        })
    });    
}
}

const getReportsSet = async (req, res) => {
  let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    var customeTag = `${req.body.courseId}_${req.body.batchId}:${req.body.channelId}`
    var options = {
        'method': 'POST',
        'url': config.DATAEXHAUSTKONGAPIURL,
        'headers': {
            'Content-Type': 'application/json'
        },
        body: {
            "request": {
                "filters": {
                    "dataset": req.body.type.replace('/', ''),
                    "channel": req.body.channelId,
                    "status": "SUCCESS"
                },
                "limit": 10000
            }
        },
        json: true
    };
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "GET EXHAUST REPORTS", "GET EXHAUST REPORT REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
          logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH EXHAUST REPORT ::: " + JSON.stringify(error), "GET EXHAUST REPORTS", "GET EXHAUST REPORT RESPONSE", data);
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                if (body.response.params.status == 'successful') {
                  logger.generateLogger("info", "{{SUCCESS}} ===> EXHAUST REPORTS FETCHED SUCCESSFULLY", "GET EXHAUST REPORTS", "GET EXHAUST REPORT RESPONSE", data);
                    const respArr = [];
                    if (body.response.result.count > 0) {
                        body.response.result.jobs.forEach(element => {
                            if (element.tag == customeTag) {
                                let temp = {
                                    requestId: element.requestId,
                                    dataset: element.dataset,
                                    requestedChannel: element.requestedChannel,
                                    report_url: _.isArray(element.downloadUrls) ? element.downloadUrls[0].split("?")[0] : element.downloadUrls.split("?")[0],
                                    status: element.status,
                                    courseId: req.body.courseId,
                                    batchId: req.body.batchId,
                                    lastUpdated: element.lastUpdated ? moment(new Date(element.lastUpdated)).add(330, 'm').format("YYYY-MM-DD HH:mm:ss") : ''
                                }
                                respArr.push(temp);
                            }
                        });
                    }
                    try {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({
                            "statusCode": 200,
                            "response": respArr,
                            "result": "Report/s exist in the blob"
                        });
                    } catch (e) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({
                            "statusCode": 200,
                            "response": e,
                            "result": "Report/sdoesn't exist in the blob"
                        });
                    }
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": respArr,
                        "result": "Report/sdoesn't exist in the blob"
                    });
                }
            } else {
              logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH EXHAUST REPORTS" + JSON.stringify(body), "GET EXHAUST REPORTS", "GET EXHAUST REPORTS RESPONSE", data);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                  "statusCode": 400,
                  "response": respArr,
                  "result": "Report/sdoesn't exist in the blob"
              });
            }
        }
    });
}

const getCourseFilter = (req) => {
    return new Promise(async function (resolve, reject) {
      try {
        let formResponse = await getFormResponse();
        let forms = [];
        await Promise.all(
          formResponse.map(async (element) => {
            if ("api" in element) {
              let options = {
                headers: {
                  userid: req.data.userId,
                  username: req.data.userName
                },
                body: JSON.parse(element.api.body),
              };
              if (element.api.token == true) {
                options["headers"]["x-authenticated-user-token"] = req.token;
              }
              switch (element.api.type) {
                case "tenant-search":
                  let orgList = await tenants.getOrgList(options);
                  if (
                    orgList.statusCode == 200 &&
                    orgList.response.responseCode == "OK" &&
                    orgList.response.result.response.count > 0
                  ) {
                    let a = orgList.response.result.response.content.sort(
                      (a, b) => a.orgName.localeCompare(b.orgName)
                    );
                    element.options = a.map((ele) => {
                      return { label: ele.orgName, value: ele.identifier };
                    });
                  }
                  break;
                case "constants-search":
                  let response = await constants.getAllConstants(
                    JSON.parse(element.api.body),
                    req.data
                  );
                  if (response.statusCode == 200) {
                    element.options = getConstantValues(response.result[0]);
                  }
                  break;
              }
              forms.push({
                index: element.index,
                label: element.label,
                description: element.description,
                placeholder: element.placeholder,
                property: element.property,
                dataType: element.dataType,
                inputType: element.inputType,
                options: element.options,
                visible: element.visible,
                editable: element.editable,
                required: element.required,
                multiple: element.multiple,
              });
            } else {
              forms.push(element);
            }
          })
        );
        forms = forms.sort((a, b) => {
          return a.index - b.index;
        });
        resolve(forms);
      } catch (er) {
        reject(er);
      }
    });
  };
  
  const getFormResponse = () => {
    return new Promise(async (resolve, reject) => {
      let formResponse = await forms.getFormData(
        JSON.parse(apiConfig.CONFIGURATIONS.SEARCH_COURSES)
      );
      if (formResponse.responseCode == "OK") {
        resolve(formResponse.result.form.data.fields);
      }
    });
  };
  
  const getConstantValues = (_cons) => {
    const arrData = [];
    const rows = _cons.fvalues.split(",");
    rows.forEach((item) => {
      const value = item.split("||")[1];
      arrData.push({ label: value, value: value });
    });
    return arrData;
  };


module.exports = { getCoursesList, downloadReport, getReportsSet, getCourseFilter }