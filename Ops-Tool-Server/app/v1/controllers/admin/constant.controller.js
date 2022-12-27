const pool = require("../../../../config/database");
const loggerUtil = require("../../../utils/loggerUtil");
const _constants = require("../../../../config/constants");

const getAllConstants = (req, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      let constantsData;
      if (req.entity && req.entity.length > 0) {
        constantsData = await getDBResponse(
          `SELECT field_name as field, GROUP_CONCAT(CONCAT_WS('||', id, field_value)) as fvalues from CONSTANTS where is_deleted=false AND field_name IN (${
            "'" + req.entity.join("', '") + "'"
          }) GROUP BY field_name`,
          "",
          data
        );
      } else {
        constantsData = await getDBResponse(
          _constants.GET_CONSTANTS_LIST,
          "",
          data
        );
      }
      constantsData.length > 0
        ? resolve({
            statusCode: 200,
            result: constantsData,
            responseCode: "OK",
            response: "Constants Fetched Successfully",
          })
        : resolve({
            statusCode: 200,
            result: [],
            responseCode: "OK",
            response: "No Constants Found",
          });
    } catch (error) {
      reject({
        statusCode: 500,
        responseCode: "ERROR",
        error: error,
      });
    }
  });
};

const addNewConstant = async (req, res) => {
  const reqHeader = req.headers;
  const data = req.body;
  loggerUtil.generateLogger(
    "info",
    "{{REQUEST}} ===> ADD CONSTANT",
    "addNewConstant",
    "Add Constant",
    data
  );

  try {
    const responseData = await getDBResponse(
      _constants.ADD_CONSTANT,
      [data.fieldName, data.fieldValue],
      data
    );
    if (responseData.affectedRows > 0) {
      loggerUtil.generateLogger(
        "info",
        "{{RESPONSE}} ===> CONSTANTS ADDED",
        "addNewConstant",
        "Add Constant",
        data
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        responseCode: "OK",
        response: "Constant added successfully",
      });
    } else {
      loggerUtil.generateLogger(
        "info",
        "{{RESPONSE}} ===> Unable to add new constant info",
        "addNewConstant",
        "Add Constant",
        data
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        responseCode: "ERROR",
        response: "Unable to add new constant info",
      });
    }
  } catch (error) {
    loggerUtil.generateLogger(
      "error",
      "{{ERROR}} ===> ERROR IN addNewConstant :::" + JSON.stringify(error),
      "addNewConstant",
      "Add Constant",
      data
    );
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: 500,
      responseCode: "ERROR",
      error: error,
    });
  }
};

const deleteConstant = async (req, res) => {
  const reqHeader = req.headers;
  const id = req.params.id;
  loggerUtil.generateLogger(
    "info",
    "{{REQUEST}} ===> DELETE CONSTANT",
    "deleteConstant",
    "Delete Constant",
    id
  );

  try {
    const responseData = await getDBResponse(
      _constants.DELETE_CONSTANT,
      Number(id),
      id
    );

    if (responseData.affectedRows > 0) {
      loggerUtil.generateLogger(
        "info",
        "{{RESPONSE}} ===> CONSTANTS DELETED",
        "deleteConstant",
        "Delete Constant",
        id
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        responseCode: "OK",
        response: "Constant deleted successfully",
      });
    } else {
      loggerUtil.generateLogger(
        "info",
        "{{RESPONSE}} ===> Unable to delete constant",
        "deleteConstant",
        "Delete Constant",
        id
      );
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        responseCode: "ERROR",
        response: "Unable to delete constant",
      });
    }
  } catch (error) {
    loggerUtil.generateLogger(
      "error",
      "{{ERROR}} ===> ERROR IN deleteConstant :::" + JSON.stringify(error),
      "deleteConstant",
      "Delete Constant",
      id
    );
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: 500,
      responseCode: "ERROR",
      error: error,
    });
  }
};

const getDBResponse = function (query, value, data) {
  return new Promise(function (resolve, reject) {
    loggerUtil.generateLogger(
      "info",
      "{{REQUEST}}",
      "DB Request =====> " + query + ":::::" + JSON.stringify(value),
      "ConstantController",
      data
    );
    pool.query(query, value, function (err, results, fields) {
      if (err) {
        loggerUtil.generateLogger(
          "error",
          "{{ERROR}}",
          "COULD NOT RETRIEVE DB VALUE FOR " +
            query +
            ":::::" +
            JSON.stringify(value),
          "ConstantController",
          data
        );
        reject(
          "COULD NOT RETRIEVE DB VALUE FOR " +
            query +
            ":::::" +
            JSON.stringify(value)
        );
      }

      loggerUtil.generateLogger(
        "info",
        "{{RESPONSE}}",
        "RETRIEVED DB VALUE =====>" + JSON.stringify(results),
        "ConstantController",
        data
      );

      resolve(results);
    });
  });
};

module.exports = { getAllConstants, addNewConstant, deleteConstant };
