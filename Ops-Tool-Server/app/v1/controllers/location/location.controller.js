var request = require("request");
var common = require("../../../routes/common");
var config = common.config();
var apiConfig = require("../../../../config/api.config.json");
var logger = require("../../../utils/loggerUtil");

const locationSearch = (req) => {
  let reqBody = req.body, reqHeader = req.headers, data = { userId: reqHeader.userid, userName: reqHeader.username };
  var options = {
    method: "POST",
    url:
      config.BASE +
      apiConfig.SUB_URL.API +
      apiConfig.SUB_URL.DATA +
      apiConfig.SUB_URL.V1 +
      apiConfig.SUB_URL.LOCATION +
      apiConfig.APIS.SEARCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: config.API_KEY,
    },
    body: reqBody,
    json: true,
  };

  return new Promise(function (resolve, reject) {
    logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "LOCATION SEARCH", "LOCATION SEARCH REQUEST", data);
    request(options, function (error, response, body) {
      if (error != null) {
        logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH LOCATION LIST ::: " + JSON.stringify(error), "LOCATION SEARCH", "LOCATION SEARCH RESPONSE", data);
        reject({
          statusCode: 500,
          error: error.error,
          error_description: error.error_description,
        });
      } else {
        if (!error && body) {
          if (body.params.status == "SUCCESS") {
            logger.generateLogger("info", "{{SUCCESS}} ===> LOCATION LIST FETCHED SUCCESSFULLY ::: ", "LOCATION SEARCH", "LOCATION SEARCH RESPONSE", data);
            resolve({
              statusCode: 200,
              response: body,
            });
          } else {
            logger.generateLogger("info", "{{SUCCESS}} ===> RESPONSE RETRIEVED ::: " + JSON.stringify(body), "LOCATION SEARCH", "LOCATION SEARCH RESPONSE", data);
            resolve({
              statusCode: 400,
              response: body,
            });
          }
        } else {
          logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH LOCATION LIST ::: " + JSON.stringify(body), "LOCATION SEARCH", "LOCATION SEARCH RESPONSE", data);
          reject({
            statusCode: 400,
            error: "Unable to fetch the locations list",
            error_description: "Unable to fetch the locations list",
          });
        }
      }
    });
  });
};

module.exports = { locationSearch };
