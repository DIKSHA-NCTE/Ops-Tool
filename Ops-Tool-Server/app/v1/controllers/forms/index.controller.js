const express = require("express");
const async = require("async");
const http = require("http");
const https = require("https");
const path = require("path");
const request = require("request");
const _ = require("lodash");
const { performance } = require("perf_hooks");
const validatorUtil = require("../../../utils/validatorUtil");
var common = require("../../../routes/common");
var config = common.config();
var apiConfig = require("../../../../config/api.config.json");
const logger = require("../../../utils/loggerUtil");
var queries = require("../../../utils/queries");
var location = require("../location/location.controller");
var constants = require("../admin/constant.controller");
var tenants = require("../organization/organization.controller");
/**
 * Initialization Framework, exposing the
 * request and response to each other, as well as reading an excel file.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 *
 */

const getFormData = async (req, user) => {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "POST",
        url:
          config.BASE +
          apiConfig.SUB_URL.API +
          apiConfig.SUB_URL.DATA +
          apiConfig.SUB_URL.V1 +
          apiConfig.SUB_URL.FORM +
          apiConfig.APIS.READ,
        headers: {
          "Content-Type": "application/json",
          Authorization: config.API_KEY,
        },
        body: req,
        json: true,
      };

      //   loggerUtil.generateLogger(
      //     "info",
      //     "{{REQUEST}} ===>" + JSON.stringify(options),
      //     "getOrgList",
      //     "Get Ecreds Org List",
      //     user
      //   );

      request(options, function (error, response, body) {
        if (error != null) {
          //   loggerUtil.generateLogger(
          //     "info",
          //     "{{ERROR}} ===>" + JSON.stringify(error),
          //     "getFormData",
          //     "Get framework specific form fields",
          //     user
          //   );
          reject(error);
        } else {
          if (!error && body) {
            // loggerUtil.generateLogger(
            //   "info",
            //   "{{SUCCESS}} ===> RESPONSE RETRIEVED",
            //   "getFormData",
            //   "Get framework specific form fields",
            //   user
            // );
            if (body) {
              resolve(body);
            } else {
              //   loggerUtil.generateLogger(
              //     "info",
              //     "{{SUCCESS}} ===> RESPONSE RETRIEVED",
              //     "getFormData",
              //     "Get framework specific form fields",
              //     user
              //   );
              resolve(body);
            }
          } else {
            // loggerUtil.generateLogger(
            //   "info",
            //   "{{ERROR}} ===>" + JSON.stringify(body),
            //   "getFormData",
            //   "Get framework specific form fields",
            //   user
            // );
            reject(error);
          }
        }
      });
    } catch (error) {
      //   loggerUtil.generateLogger(
      //     "error",
      //     "{{ERROR}} ===> ERROR IN getFormData :::" + JSON.stringify(error),
      //     "getFormData",
      //     "Get framework specific form fields",
      //     user
      //   );
      return error;
    }
  });
};

//Latest one and above is obsolete
const formRead = async (req, res) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  try {
    var options = {
      method: "POST",
      url:
        config.BASE +
        apiConfig.SUB_URL.API +
        apiConfig.SUB_URL.DATA +
        apiConfig.SUB_URL.V1 +
        apiConfig.SUB_URL.FORM +
        apiConfig.APIS.READ,
      headers: {
        "Content-Type": "application/json",
        Authorization: config.API_KEY,
      },
      body: reqBody,
      json: true,
    };

    logger.generateLogger(
      "info",
      "{{REQUEST}} ===>" + JSON.stringify(options),
      "FORM READ",
      "FORM READ REQUEST",
      data
    );

    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger(
          "info",
          "{{ERROR}} ===>" + JSON.stringify(error),
          "FORM READ",
          "FORM READ RESPONSE",
          data
        );
        return res
          .status(400)
          .setHeader("Content-Type", "application/json")
          .send({ statusCode: 400, response: [], error: error });
      } else {
        if (!error && body) {
          if (body.responseCode == 'OK') {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> FORM DATA FETCHED SUCCESSFULLY",
              "FORM READ",
              "FORM READ RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ statusCode: 200, response: body });
            res.end();
          } else {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> RESPONSE RETRIEVED",
              "FORM READ",
              "FORM READ RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ statusCode: 200, response: body });
          }
        } else {
          logger.generateLogger(
            "info",
            "{{ERROR}} ===>" + JSON.stringify(body),
            "FORM READ",
            "FORM READ RESPONSE",
            data
          );
          return res
            .status(400)
            .setHeader("Content-Type", "application/json")
            .send({ statusCode: 400, response: [], error: body });
        }
      }
    });
  } catch (error) {
    logger.generateLogger(
      "error",
      "{{ERROR}} ===> ERROR IN FORM READ :::" + JSON.stringify(error),
      "FORM READ",
      "Get Form Read Data",
      data
    );
    return res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .send({ statusCode: 400, response: [], error: error });
  }
};

const formUpdate = async (req, res) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  try {
    var options = {
      method: "POST",
      url:
        config.BASE +
        apiConfig.SUB_URL.API +
        apiConfig.SUB_URL.DATA +
        apiConfig.SUB_URL.V1 +
        apiConfig.SUB_URL.FORM +
        apiConfig.APIS.UPDATE,
      headers: {
        "Content-Type": "application/json",
        Authorization: config.API_KEY,
      },
      body: reqBody,
      json: true,
    };
    logger.generateLogger(
      "info",
      "{{REQUEST}} ===>" + JSON.stringify(options),
      "FORM UPDATE",
      "FORM UPDATE REQUEST",
      data
    );

    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger(
          "info",
          "{{ERROR}} ===>" + JSON.stringify(error),
          "FORM UPDATE",
          "FORM UPDATE RESPONSE",
          data
        );
        return res
          .status(400)
          .setHeader("Content-Type", "application/json")
          .send({ statusCode: 400, response: [], error: error });
      } else {
        if (!error && body) {
          if (body.params.status == 'successful') {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> FORM UPDATED SUCCESSFULLY",
              "FORM UPDATE",
              "FORM UPDATE RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ statusCode: 200, response: body });
            res.end();
          } else {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> RESPONSE RETRIEVED",
              "FORM UPDATE",
              "FORM UPDATE RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ statusCode: 400, response: body });
          }
        } else {
          logger.generateLogger(
            "info",
            "{{ERROR}} ===>" + JSON.stringify(body),
            "FORM UPDATE",
            "FORM UPDATE RESPONSE",
            data
          );
          return res
            .status(400)
            .setHeader("Content-Type", "application/json")
            .send({ statusCode: 400, response: [], error: body });
        }
      }
    });
  } catch (error) {
    logger.generateLogger(
      "error",
      "{{ERROR}} ===> ERROR IN UPDATING FORM :::" + JSON.stringify(error),
      "FORM UPDATE",
      "Get Form Update Data",
      data
    );
    return res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .send({ statusCode: 400, response: [], error: error });
  }
};

const formList = async (req, res) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  try {
    var options = {
      method: "POST",
      url:
        config.BASE +
        apiConfig.SUB_URL.API +
        apiConfig.SUB_URL.DATA +
        apiConfig.SUB_URL.V1 +
        apiConfig.SUB_URL.FORM +
        apiConfig.APIS.LIST,
      headers: {
        "Content-Type": "application/json",
        Authorization: config.API_KEY,
      },
      body: reqBody,
      json: true,
    };
    logger.generateLogger(
      "info",
      "{{REQUEST}} ===>" + JSON.stringify(options),
      "FORM LIST",
      "FORM LIST REQUEST",
      data
    );

    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger(
          "info",
          "{{ERROR}} ===>" + JSON.stringify(error),
          "FORM LIST",
          "FORM LIST RESPONSE",
          data
        );
        return res
          .status(400)
          .setHeader("Content-Type", "application/json")
          .send({ statusCode: 400, response: [], error: error });
      } else {
        if (!error && body) {
          if (body.params.status == 'successful') {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> FORM LIST FETCHED SUCCESSFULLY",
              "FORM LIST",
              "FORM LIST RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ statusCode: 200, response: body });
            res.end();
          } else {
            logger.generateLogger(
              "info",
              "{{SUCCESS}} ===> RESPONSE RETRIEVED",
              "FORM LIST",
              "FORM LIST RESPONSE",
              data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ statusCode: 400, response: body });
          }
        } else {
          logger.generateLogger(
            "info",
            "{{ERROR}} ===>" + JSON.stringify(body),
            "FORM LIST",
            "FORM LIST RESPONSE",
            header
          );
          return res
            .status(400)
            .setHeader("Content-Type", "application/json")
            .send({ statusCode: 400, response: [], error: body });
        }
      }
    });
  } catch (error) {
    logger.generateLogger(
      "error",
      "{{ERROR}} ===> UNABLE TO FETCH FORM LIST :::" + JSON.stringify(error),
      "FORM LIST",
      "Get Form List Data",
      header
    );
    return res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .send({ statusCode: 400, response: [], error: error });
  }
};

const getFilterData = async (req, res) => {
  let url = req.url, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  let response;
  if (req.headers.userid === req.session.userId) {
    try {
      let token = JSON.parse(req.session["keycloak-token"])["access_token"];
      switch(url.split('/')[1]) {
        case 'subrole':
          response = await getFormsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.UPDATE_SUBROLE,
          });
          break;
        case 'list':
          response = await getFormsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.FORMS_LIST,
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

const getFormsFilter = (req) => {
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
                element.options.unshift({ label: 'All', value: '*' })
                break;
              case "state-search":
                let stateList = await location.locationSearch(options);
                if (
                  stateList.statusCode == 200 &&
                  stateList.response.responseCode == "OK" &&
                  stateList.response.result.response.length > 0
                ) {
                  let a = stateList.response.result.response.sort(
                    (a, b) => a.name.localeCompare(b.name)
                  );
                  element.options = a.map((ele) => {
                    return { label: ele.name, value: ele.code };
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
    let formResponse = await getFormData(
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

Object.assign(
  module.exports,
  {
    getFormData,
    formRead,
    formList,
    formUpdate,
    getFilterData
  }
)
