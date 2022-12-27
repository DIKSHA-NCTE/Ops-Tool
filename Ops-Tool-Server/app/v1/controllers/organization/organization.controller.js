var request = require("request");
var logger = require("../../../utils/loggerUtil");
var common = require("../../../routes/common");
var config = common.config();
var apiConfig = require("../../../../config/api.config.json");
var forms = require("../forms/index.controller");
var constants = require("../admin/constant.controller");

const getOrgList = (req) => {
  let reqBody = req.body, token= req.token, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  if (
    reqBody.hasOwnProperty("request") &&
    reqBody.request.hasOwnProperty("sort_by")
  ) {
    reqBody.request["sort_by"] = {};
  }
  const options = {
    method: "POST",
    url:
      config.BASE +
      apiConfig.SUB_URL.API +
      apiConfig.SUB_URL.ORG +
      apiConfig.SUB_URL.V1 +
      apiConfig.APIS.SEARCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: config.API_KEY,
      "x-authenticated-user-token": token
    },
    body: reqBody,
    json: true,
  };
  logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "LIST ORGANIZATIONS", "LIST ORGANIZATIONS REQUEST", data);
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH ORG LIST ::: " + JSON.stringify(error), "LIST ORGANIZATIONS", "LIST ORGANIZATIONS RESPONSE", data);
        reject({
          statusCode: 500,
          error: error.error,
          error_description: error.error_description,
        });
      } else {
        if (!error && body) {
          if (body.params.status == "SUCCESS") {
            logger.generateLogger("info", "{{SUCCESS}} ===> ORG LIST FETCHED SUCCESSFULLY", "LIST ORGANIZATIONS", "LIST ORGANIZATIONS RESPONSE", data);
            resolve({
              statusCode: 200,
              response: body,
            });
          } else {
            logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE TETRIEVED ::: " + JSON.stringify(body), "LIST ORGANIZATIONS", "LIST ORGANIZATIONS RESPONSE", data);
            resolve({
              statusCode: 400,
              response: body,
            });
          }
        } else {
          logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH ORG LIST ::: " + JSON.stringify(body), "LIST ORGANIZATIONS", "LIST ORGANIZATIONS RESPONSE", data);
          reject({
            statusCode: 400,
            error: "Unable to fetch the organization list",
            error_description: "Unable to fetch the organization list",
          });
        }
      }
    });
  });
};

const readOrg = (req, res) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  var options = {
      method: 'POST',
      url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.ORG + apiConfig.SUB_URL.V1 + apiConfig.APIS.READ,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': config.API_KEY
      },
      body: reqBody,
      json: true
  }

  logger.generateLogger("info", "{{REQUEST}}", "READ ORG REQUEST FOR " + reqBody.request.organisationId + "::: =====>" + JSON.stringify(options), "READ ORGANIZATION", data);

  request(options, function (error, response, body) {
      if (error != null) {
          logger.generateLogger("error", "{{ERROR}}", "READ ORG RESPONSE FOR " + reqBody.request.organisationId + "::: =====> Error in fetching the org data for " + data.organisationId + "----->" + JSON.stringify(error), "READ ORGANIZATION", data);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          return res.json({
              "statusCode": 500,
              "error": error.error,
              "error_description": error.error_description
          })
      } else {
          if (!error && body) {
              logger.generateLogger("info", "{{RESPONSE}}", "READ ORG RESPONSE FOR " + reqBody.request.organisationId + "::: =====>" + "ORG DATA FETCHED SUCCESSFULLY", "READ ORGANIZATION", data);
              if (body.params.status == 'SUCCESS') {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  return res.json({
                      "statusCode": 200,
                      "response": body.result
                  })
              } else {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  return res.json({
                      "statusCode": 400,
                      "response": body
                  })
              }

          } else {
              logger.generateLogger("error", "{{ERROR}}", "READ ORG RESPONSE FOR " + reqBody.request.organisationId + "::: =====> Error in fetching the org data for " + data.organisationId + "----->" + JSON.stringify(body), "READ ORGANIZATION", data);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                  "statusCode": 400,
                  "error": "Unable to fetch the org details",
                  "error_description": "Unable to fetch the org details"
              })
          }
      }
  });
}

const createOrganization = (req) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  const options = {
    method: "POST",
    url:
      config.BASE +
      apiConfig.SUB_URL.API +
      apiConfig.SUB_URL.ORG +
      apiConfig.SUB_URL.V1 +
      apiConfig.APIS.CREATE,
    headers: {
      "Content-Type": "application/json",
      Authorization: config.API_KEY,
      "x-authenticated-user-token": reqBody.token,
    },
    body: reqBody,
    json: true,
  };
  logger.generateLogger("info", "{{REQUEST}}", "CREATE ORG - API CALL REQUEST ::::: ==============>" + JSON.stringify(options), "CREATE ORGANIZATION", data);
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger("error", "{{ERROR}}", "CREATE ORG - API CALL ERROR ::::: ==============>" + JSON.stringify(error), "CREATE ORGANIZATION", data);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        reject({
          statusCode: 500,
          error: error.error,
          error_description: error.error_description,
        });
      } else {
        if (!error && body) {
          logger.generateLogger("info", "{{RESPONSE}}", "CREATE ORG - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "CREATE ORGANIZATION", data);
          if (body.params.status == "SUCCESS") {
            logger.generateLogger("info", "{{RESPONSE}}", "ORG CREATED SUCCESSFULLY", "CREATE ORGANIZATION", data);
            resolve({
              statusCode: 200,
              response: body,
            });
          } else {
            reject({
              statusCode: 400,
              response: body,
            });
          }
        } else {
          logger.generateLogger("error", "{{error}}", "CREATE ORG - API CALL ERROR ::::: ==============>" + JSON.stringify(body), "CREATE ORGANIZATION", data);
          reject({
            statusCode: 400,
            error: "Unable to create organization",
            error_description: "Unable to create organization"
          });
        }
      }
    });
  });
}

const updateOrganization = (req) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  const options = {
    method: "PATCH",
    url:
      config.BASE +
      apiConfig.SUB_URL.API +
      apiConfig.SUB_URL.ORG +
      apiConfig.SUB_URL.V1 +
      apiConfig.APIS.UPDATE,
    headers: {
      "Content-Type": "application/json",
      Authorization: config.API_KEY,
      "x-authenticated-user-token": reqBody.token,
    },
    body: reqBody,
    json: true,
  };
  logger.generateLogger("info", "{{REQUEST}}", "UPDATE ORG - API CALL REQUEST ::::: ==============>" + JSON.stringify(options), "UPDATE ORGANIZATION", data);
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger("error", "{{ERROR}}", "UPDATE ORG - API CALL ERROR ::::: ==============>" + JSON.stringify(error), "UPDATE ORGANIZATION", data);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        reject({
          statusCode: 500,
          error: error.error,
          error_description: error.error_description,
        });
      } else {
        if (!error && body) {
          logger.generateLogger("info", "{{RESPONSE}}", "UPDATE ORG - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "UPDATE ORGANIZATION", data);
          if (body.params.status == "SUCCESS") {
            logger.generateLogger("info", "{{RESPONSE}}", "ORG UPDATED SUCCESSFULLY", "UPDATED ORGANIZATION", data);
            resolve({
              statusCode: 200,
              response: body,
            });
          } else {
            reject({
              statusCode: 400,
              response: body,
            });
          }
        } else {
          logger.generateLogger("error", "{{error}}", "UPDATE ORG - API CALL ERROR ::::: ==============>" + JSON.stringify(body), "UPDATE ORGANIZATION", data);
          reject({
            statusCode: 400,
            error: "Unable to update organization",
            error_description: "Unable to update organization"
          });
        }
      }
    });
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
          response = await getOrganizationsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.ORGANIZATIONS_LIST
          });
          break;
        case 'create':
          response = await getOrganizationsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.ORGANIZATIONS_CREATE
          });
          break;
        case 'update':
          response = await getOrganizationsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.ORGANIZATIONS_UPDATE
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

const getOrganizationsFilter = (req) => {
  return new Promise(async function (resolve, reject) {
    try {
      let formResponse = await getFormResponse(req.formPayload);
      let module = JSON.parse(req.formPayload).request.subType
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
                let orgList = await getOrgList(options);
                if (
                  orgList.statusCode == 200 &&
                  orgList.response.responseCode == "OK" &&
                  orgList.response.result.response.count > 0
                ) {
                  let a = orgList.response.result.response.content.sort(
                    (a, b) => a.orgName.localeCompare(b.orgName)
                  );
                  element.options = a.map((ele) => {
                    if (module === 'organizations-update') {
                      return { label: ele.orgName, value: ele.identifier };
                    } else {
                      return { label: ele.orgName, value: ele.channel };
                    }
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

module.exports = { getOrgList, readOrg, createOrganization, updateOrganization, getFilterData  };
