const express = require('express');
var request = require('request');
var logger = require('../../../utils/loggerUtil');
var path = require('path');
var async = require('async');
var cmd = require('node-cmd');
var fs = require('fs');
var common = require('../../../routes/common');
var config = common.config();
var apiConfig = require('../../../../config/api.config.json');
var pool = require('../../../../config/database');
var tenants = require("../organization/organization.controller");
var forms = require("../forms/index.controller");
var constants = require("../admin/constant.controller");

const updateUserDetails = async (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let access_token = req.body["access_token"];

    var options = {
        method: 'PATCH',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.UPDATE,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': access_token,
        },
        body: {
            request: reqBody.request
        },
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "UPDATE USER DETAILS", "UPDATE USER DETAILS REQUEST", data);

    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("info", "{{ERROR}} ===> ERROR IN UPDATING THE USER DETAILS ::: " + JSON.stringify(error), "UPDATE USER DETAILS", "UPDATE USER DETAILS RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                logger.generateLogger("info", "{{SUCCESS}} ===> USER DETAILS UPDATED SUCCESSFULLY ::: " + JSON.stringify(body), "UPDATE USER DETAILS", "UPDATE USER DETAILS RESPONSE", data);
                if (body.params.status == 'SUCCESS') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIEVED ::: " + JSON.stringify(body), "UPDATE USER DETAILS", "UPDATE USER DETAILS RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("info", "{{ERROR}} ===> UNABLE TO UPDATE USER DETAILS ::: " + JSON.stringify(body), "UPDATE USER DETAILS", "UPDATE USER DETAILS RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to update user details",
                    "error_description": "Unable to update user details"
                })
            }
        }
    });
}

const bulkUserUpload = (req, res) => {
    let data = req.file;
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.LEARNER + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.UPLOAD,
        headers: {
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': req.headers['x-authenticated-user-token']
        },
        formData: {
            user: fs.createReadStream(req.file.path),
        }
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USERS ACTIONS", "BULK USER UPLOAD REQUEST", { userId: "", userName: "" });

    request(options, function (error, response, body) {
        let bodyData = JSON.parse(body);
        if (error != null) {
            logger.generateLogger("ERROR", "{{ERROR}} ===> ERROR IN UPLOADING USERS ::: " + JSON.stringify(error), "USERS ACTIONS", "BULK USER UPLOAD RESPONSE", { userId: "", userName: "" });
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && bodyData.responseCode == "OK") {
                if (bodyData['params']['status'] == 'success') {
                    logger.generateLogger("info", "{{SUCCESS}} ===> BULK USERS UPLOADED SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "BULK USER UPLOAD RESPONSE", { userId: "", userName: "" });
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": bodyData
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> BULK USERS UPLOADED SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "BULK USER UPLOAD RESPONSE", { userId: "", userName: "" });
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": bodyData
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO UPLOAD BULK USERS ::: " + JSON.stringify(body), "USERS ACTIONS", "BULK USER UPLOAD RESPONSE", { userId: "", userName: "" });
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to upload bulk users",
                    "error_description": "Unable to upload bulk users"
                })
            }
        }
    });

}

const getUserDetails = async (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let access_token = req.body["access_token"];

    var options = {
        method: 'GET',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.READ + "/" + reqBody.id,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': access_token
        },
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "GET USER DETAILS", "GET USER DETAILS REQUEST", data);

    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> ERROR IN FETCHING USER DETAILS ::: ", "GET USER DETAILS", "GET USER DETAILS RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                logger.generateLogger("info", "{{SUCCESS}} ===> USER DETAILS FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "GET USER DETAILS", "GET USER DETAILS RESPONSE", data);
                if (body.params.status == 'SUCCESS') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIEVED ::: " + JSON.stringify(body), "GET USER DETAILS", "GET USER DETAILS RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USER DETAILS ::: " + JSON.stringify(body), "GET USER DETAILS", "GET USER DETAILS RESPONSE", data);
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

const userProcessList = (req, res) => {
    let type = req.body.checkStatus;
    let query = [], bulkQuery = [];
    let userInfo, batchStatus = "completed", contentStatus, process_id, channel;
    if (req.body.hasOwnProperty('channel')) {
        channel = req.body.channel;
        query.push("channelId='" + channel + "'");
        bulkQuery.push("channelId='" + channel + "'")
    }

    if (req.body.hasOwnProperty('batchStatus')) {
        batchStatus = req.body.batchStatus;
        query.push("status='" + batchStatus + "'");
        bulkQuery.push("status='" + batchStatus + "'");
    }

    if (!req.body.hasOwnProperty('batchStatus') && type == "batchJob") {
        bulkQuery.push("status='completed'");
    }

    if (req.body.hasOwnProperty('userInfo')) {
        userInfo = req.body.userInfo;
        bulkQuery.push("adminEmail='" + userInfo + "'");
    }

    let b = bulkQuery.join(" AND ");
    let sqlStmt = "";
    if (b.length == 0) {
        sqlStmt = "SELECT * FROM USER_BULK_UPLOAD";
    } else {
        sqlStmt = "SELECT * FROM USER_BULK_UPLOAD WHERE " + b + "ORDER BY createdAt DESC;";
    }
    //let selectSql = `SELECT * FROM CONTENT_BULK_UPLOAD WHERE channelId = '${channelId}' ORDER BY createdAt DESC`;
    pool.query(sqlStmt, function (err, result) {
        if (err) {
            res.statusCode = 500;
            return res.json({
                "status": 502, "error": 'Could not retrieve status list', "response": null
            });
        }
        res.statusCode = 200;
        res.json({
            "status": 200, "error": null, "response": result
        });

    });

}

const searchUsersList = (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let token;
    if (req.headers.userid === req.session.userId) {
        token = JSON.parse(req.session['keycloak-token'])['access_token']
    }

    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.SEARCH,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': token
        },
        body: reqBody,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "SEARCH USERS", "SEARCH USERS LIST REQUEST", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USERS LIST ::: " + JSON.stringify(error), "SEARCH USERS", "SEARCH USERS LIST RESPONSE", data);
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
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS LIST FETCHED SUCCESSFULLY ::: ", "SEARCH USERS", "SEARCH USERS LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIVED ::: " + JSON.stringify(body), "SEARCH USERS", "SEARCH USERS LIST RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH USERS LIST ::: " + JSON.stringify(body), "SEARCH USERS", "SEARCH USERS LIST RESPONSE", data);
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

async function userRoleAssign(req, res) {
    let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    let access_token = req.body["refresh_token"];
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.ROLEASSIGN,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': access_token,
        },
        body: {
            request: reqBody.request
        },
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USER ROLE ASSIGN", "UPDATE USER ROLES REQUEST", data);

    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("info", "{{ERROR}} ===> ERROR IN UPDATING THE USER ROLES ::: " + JSON.stringify(error), "USER ROLE ASSIGN", "UPDATE USER ROLES RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                logger.generateLogger("info", "{{SUCCESS}} ===> USER ROLES UPDATED SUCCESSFULLY ::: " + JSON.stringify(body), "USER ROLE ASSIGN", "UPDATE USER ROLES RESPONSE", data);
                if (body.params && body.params.status == 'SUCCESS') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIEVED ::: " + JSON.stringify(body), "USER ROLE ASSIGN", "UPDATE USER ROLES RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("info", "{{ERROR}} ===> UNABLE TO UPDATE USER ROLES ::: " + JSON.stringify(body), "USER ROLE ASSIGN", "UPDATE USER ROLES RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to update user details",
                    "error_description": "Unable to update user details"
                })
            }
        }
    });
}
const unBlockUser = (req, res) => {
    let data = req.body;
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.UNBLOCK,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': data.token
        },
        body: data.request,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USERS ACTIONS", "BLOCK USER API", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH unblock User ::: " + JSON.stringify(error), "USERS ACTIONS", "unblock USERS  RESPONSE", data);
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
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS unblock SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "unblock USERS  RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS unblock  SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "unblock USERS  RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO unblock USERS  ::: " + JSON.stringify(body), "USERS ACTIONS", "unblock USERS  RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to unblock the user",
                    "error_description": "Unable to unblock the user"
                })
            }
        }
    });
}
const blockUser = (req, res) => {
    let data = req.body;
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.BLOCK,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': data.token
        },
        body: data.request,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USERS ACTIONS", "BLOCK USER API", data);
    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH block User ::: " + JSON.stringify(error), "USERS ACTIONS", "block USERS  RESPONSE", data);
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
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS block SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "block USERS  RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("info", "{{SUCCESS}} ===> USERS block  SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "block USERS  RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO block USERS  ::: " + JSON.stringify(body), "USERS ACTIONS", "block USERS  RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to block the user",
                    "error_description": "Unable to block the user"
                })
            }
        }
    });
}

const createIndividualUser = (req, res) => {
    let reqBody = req.body, reqHeader = req.headers, data = { userId: reqHeader.userid, userName: reqHeader.username };
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.CREATE,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': reqHeader.token,
        },
        body: reqBody,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "CREATE INDIVIDUAL USER", "CREATE INDIVIDUAL USER REQUEST", data);

    request(options, function (error, response, body) {
        if (error != null) {
            logger.generateLogger("error", "{{ERROR}} ===> ERROR IN CREATING THE USER ::: " + JSON.stringify(error), "CREATE INDIVIDUAL USER", "CREATE INDIVIDUAL USER RESPONSE", data);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                logger.generateLogger("info", "{{SUCCESS}} ===> USER CREATED SUCCESSFULLY ::: " + JSON.stringify(body), "CREATE INDIVIDUAL USER", "CREATE INDIVIDUAL USER RESPONSE", data);
                if (body.params.status == 'SUCCESS') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    logger.generateLogger("error", "{{ERROR}} ===> ERROR IN CREATING USER ::: " + JSON.stringify(body), "CREATE INDIVIDUAL USER", "CREATE INDIVIDUAL USER RESPONSE", data);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO CREATE THE USER ::: " + JSON.stringify(body), "CREATE INDIVIDUAL USER", "CREATE INDIVIDUAL USER RESPONSE", data);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 400,
                    "error": "Unable to update user details",
                    "error_description": "Unable to update user details"
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
          case 'list':
            response = await getUsersFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.USERS_LIST
            });
            break;
          case 'create':
            response = await getUsersFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.CREATE_USERS
            });
            break;
          case 'upload':
            response = await getUsersFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.USERS_UPLOAD
            });
            break;
          case 'upload_status':
            response = await getUsersFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.USERS_UPLOAD_STATUS
            });
            break;
          case 'batch_upload_list':
            response = await getUsersFilter({
              data,
              token: token,
              formPayload: apiConfig.CONFIGURATIONS.USERS_BATCH_UPLOAD_LIST
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

const getUsersFilter = (req) => {
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
                appearance: element.appearance
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

module.exports = { updateUserDetails, blockUser, unBlockUser, getUserDetails, searchUsersList, userProcessList, userRoleAssign, createIndividualUser, getFilterData };
