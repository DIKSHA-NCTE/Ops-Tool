const express = require("express");
var request = require("request");
const logger = require("../../../utils/loggerUtil");
var path = require("path");
var async = require("async");
var cmd = require("node-cmd");
var fs = require("fs");
var common = require("../../../routes/common");
var config = common.config();
var apiConfig = require("../../../../config/api.config.json");
var forms = require("../forms/index.controller");
var tenants = require("../organization/organization.controller");
var constants = require("../admin/constant.controller");
const SearchContents = (req, res) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  var options = {
    method: "POST",
    url:
      config.BASE +
      apiConfig.SUB_URL.API +
      apiConfig.SUB_URL.CONTENT +
      apiConfig.SUB_URL.V1 +
      apiConfig.APIS.SEARCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: config.API_KEY
    },
    body: reqBody,
    json: true,
  };
  logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "SEARCH CONTENTS", "CONTENTS SEARCH REQUEST", data);
  request(options, function (error, response, body) {
    if (error != null) {
      logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FECTH CONTENTS LIST ::: " + JSON.stringify(error), "SEARCH CONTENTS", "CONTENTS SEARCH RESPONSE", data);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 500,
        error: error.error,
        error_description: error.error_description,
      });
    } else {
      if (!error && body) {
        if (body.responseCode == "OK") {
          logger.generateLogger("info", "{{SUCCESS}} ===> CONTENTS LIST FETCHED SUCCESSFULLY ::: ", "SEARCH CONTENTS", "CONTENTS SEARCH RESPONSE", data);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            statusCode: 200,
            response: body.result,
          });
        } else {
          logger.generateLogger("info", "{{SUCCESS}} ===> CONTENTS LIST FETCHED SUCCESSFULLY ::: " + JSON.stringify(body), "SEARCH CONTENTS", "CONTENTS SEARCH RESPONSE", data);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            statusCode: 400,
            response: body,
          });
        }
      } else {
        logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH CONTENTS LIST ::: " + JSON.stringify(body), "SEARCH CONTENTS", "CONTENTS SEARCH RESPONSE", data);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 400,
          error: "Unable to fetch the user details",
          error_description: "Unable to fetch the user details",
        });
      }
    }
  });
};

const getFilterData = async (req, res) => {
  let url = req.url, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
  let response;
  if (req.headers.userid === req.session.userId) {
    try {
      let token = JSON.parse(req.session["keycloak-token"])["access_token"];
      switch(url.split('/')[1]) {
        case 'list':
          response = await getContentsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.CONTENTS_LIST
          });
          break;
        case 'upload':
          response = await getContentsFilter({
            data,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.CONTENTS_UPLOAD
          });
          break;
        case 'upload_status':
          response = await getContentsFilter({
            userId: req.headers.userid,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.CONTENTS_UPLOAD_STATUS,
            data
          });
          break;
        case 'batch_upload_list':
          response = await getContentsFilter({
            userId: req.headers.userid,
            token: token,
            formPayload: apiConfig.CONFIGURATIONS.CONTENTS_BATCH_UPLOAD_LIST,
            data
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

const getContentsFilter = (req) => {
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
              case "board-search":
              case "medium-search":
              case "grade-search":
              case "subject-search":
              case "content_type-search":
              case "mime_type-search":
              case "primaryCategory-search":
              case "additionalCategories-search":
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

module.exports = { SearchContents, getContentsFilter, getFilterData };
