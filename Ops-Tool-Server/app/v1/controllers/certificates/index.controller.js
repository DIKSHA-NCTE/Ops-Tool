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
const appRoot = require('app-root-path');
const fs = require("fs");
const cheerio = require('cheerio');
var apiConfig = require("../../../../config/api.config.json");
var forms = require("../forms/index.controller");
var constants = require("../admin/constant.controller");
var tenants = require("../organization/organization.controller");

const searchUserListing = (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.SEARCH,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': JSON.parse(req.session["keycloak-token"])["access_token"]
        },
        body: reqBody,
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "SEARCH USERS LIST - ENROLLMENT", "SEARCH USERS LIST REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USERS LIST ::: " + JSON.stringify(error), "SEARCH USERS LIST - ENROLLMENT", "SEARCH USERS LIST RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                if (body.params.status == 'SUCCESS') {
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS LIST FETCHED SUCCESSFULLY ::: ", "SEARCH USERS LIST - ENROLLMENT", "SEARCH USERS LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS LIST FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "SEARCH USERS LIST - ENROLLMENT", "SEARCH USERS LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USERS LIST ::: " + JSON.stringify(body), "SEARCH USERS LIST - ENROLLMENT", "SEARCH USERS LIST RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to fetch the user details",
                    "error_description": "Unable to fetch the user details"
                })
            }
        }
    });
}

const enrollmentList = async (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userId: reqHeader.userid, userName: reqHeader.username };
    let options = {
        method: 'GET',
        url: config.BASE + apiConfig.APIS.ENROLLMENT + JSON.parse(reqBody.metaInfo).userId + '?fields=contentType,topic,name,channel&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': req.body["refresh_token"]
        },
        body: {},
        json: true
    };
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USER ENROLLMENT", "USER ENROLLMENT LIST REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USER ENROLLMENT LIST ::: " + JSON.stringify(error), "USER ENROLLMENT", "USER ENROLLMENT LIST RESPONSE", data);
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
                    logger.generateLogger("info", "{{SUCCESS}} ===> USER ENROLLMENT LIST FETCHED SUCCESSFULLY ::: ", "USER ENROLLMENT", "USER ENROLLMENT LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> USER ENROLLMENT LIST FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "USER ENROLLMENT", "USER ENROLLMENT LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USER ENROLLMENT LIST ::: " + JSON.stringify(body), "USER ENROLLMENT", "USER ENROLLMENT LIST RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to fetch the USER ENROLLMENT details",
                    "error_description": "Unable to fetch the USER ENROLLMENT details"
                })
            }
        }
    });
}

const downloadPdfCertificate = async (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userId: reqHeader.userid, userName: reqHeader.username };
    let options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.APIS.CERT_DOWNLOAD,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': req.body["refresh_token"]
        },
        body: {
            "request": {
                "pdfUrl": reqBody.certificateIdentifier
            }
        },
        json: true
    };
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "DOWNLOAD PDF CERTIFICATE", "DOWNLOAD PDF CERTIFICATE REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD CERTIFICATE ::: " + JSON.stringify(error), "DOWNLOAD PDF CERTIFICATE", "DOWNLOAD PDF CERTIFICATE RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                if (body.responseCode == 'OK') {
                    logger.generateLogger("info", "{{SUCCESS}} ===> CERTIFICATE DATA FETCHED SUCCESSFULLY ::: ", "DOWNLOAD PDF CERTIFICATE", "DOWNLOAD PDF CERTIFICATE RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> CERTIFICATE DATA FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "DOWNLOAD PDF CERTIFICATE", "DOWNLOAD PDF CERTIFICATE RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD CERTIFICATE ::: " + JSON.stringify(body), "DOWNLOAD PDF CERTIFICATE", "DOWNLOAD PDF CERTIFICATE RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to Download certificates",
                    "error_description": " Download certificates"
                })
            }
        }
    });

}

const downloadSvgCertificate = async (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userId: reqHeader.userid, userName: reqHeader.username };
    let options = {
        method: 'GET',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.APIS.SVG_CERT_DOWNLOAD + reqBody.certificateIdentifier,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': req.body["refresh_token"]
        },
        json: true
    };
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "DOWNLOAD SVG CERTIFICATE", "DOWNLOAD SVG CERTIFICATE REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD CERTIFICATE ::: " + JSON.stringify(error), "DOWNLOAD SVG CERTIFICATE", "DOWNLOAD SVG CERTIFICATE RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                if (body.responseCode == 'OK') {
                    logger.generateLogger("info", "{{SUCCESS}} ===> CERTIFICATE DATA FETCHED SUCCESSFULLY ::: " , "DOWNLOAD SVG CERTIFICATE", "DOWNLOAD SVG CERTIFICATE RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> CERTIFICATE DATA FETCHED SUCCESSFULLY ::: " , "DOWNLOAD SVG CERTIFICATE", "DOWNLOAD SVG CERTIFICATE RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD CERTIFICATE ::: " + JSON.stringify(body), "DOWNLOAD SVG CERTIFICATE", "DOWNLOAD SVG CERTIFICATE RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to Download certificates",
                    "error_description": "Download certificates"
                })
            }
        }
    });

}

const searchCourseBatch = (req, res) => {
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
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "SEARCH COURSE CERTIFICATES", "SEARCH COURSE CERTIFICATES REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH COURSE CERTIFICATES ::: " + JSON.stringify(error), "SEARCH COURSE CERTIFICATES", "SEARCH COURSE CERTIFICATES RESPONSE", data);
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
                    logger.generateLogger("info", "{{SUCCESS}} ===> COURSE CERTIFICATES FETCHED SUCCESSFULLY ::: ", "SEARCH COURSE CERTIFICATES", "SEARCH COURSE CERTIFICATES RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> COURSE CERTIFICATES FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "SEARCH COURSE CERTIFICATES", "SEARCH COURSE CERTIFICATES RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }
            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH COURSE CERTIFICATES ::: " + JSON.stringify(body), "SEARCH COURSE CERTIFICATES", "SEARCH COURSE CERTIFICATES RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to fetch certificates",
                    "error_description": "Unable to fetch certificates"
                })
            }
        }
    });
}

const getFilterData = async (req, res) => {
    let url = req.url, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let response;
    if (req.headers.userid === req.session.userId) {
      try {
        let token = JSON.parse(req.session["keycloak-token"])["access_token"];
        switch(url.split('/')[1]) {
          case 'user':
            response = await getCertificateFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.SEARCH_USER_CERTIFICATES
            });
            break;
          case 'course':
            response = await getCertificateFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.SEARCH_COURSE_CERTIFICATES
            });
            break;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 200,
          response: response,
        });
      } catch (er) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 500,
          error: er.error,
          error_description: er.error_description,
        });
      }
    }
  };

const getCertificateFilter = (req) => {
    return new Promise(async function (resolve, reject) {
      try {
        let formResponse = await getFormResponse(req.formPayload);
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
  
  const getFormResponse = (payload) => {
    return new Promise(async (resolve, reject) => {
      let formResponse = await forms.getFormData(
        JSON.parse(payload)
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

module.exports = { searchUserListing, enrollmentList, downloadPdfCertificate, downloadSvgCertificate, searchCourseBatch, getFilterData }