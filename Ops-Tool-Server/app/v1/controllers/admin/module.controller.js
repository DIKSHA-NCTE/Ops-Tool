const loggerUtil = require("../../../utils/loggerUtil");
const pool = require("../../../../config/database");
var _constants = require('../../../../config/constants');
const queries = require('../../../utils/queries');


const getAllModules = async (req, res) => {
    let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid }, modulesList;
    try {
        loggerUtil.generateLogger(
            "info",
            "{{REQUEST}} ===> GET ALL MODULES",
            "getAllModules",
            "Get All Modules",
            data
        );

        modulesList = await getDBResponse(_constants.GET_MODULES_LIST, '', data);
        if (modulesList.length > 0) {
            loggerUtil.generateLogger(
                "info",
                "{{RESPONSE}} ===> MODULES RETRIEVED",
                "getAllModules",
                "Get All Modules",
                data
            );
            let response = await modulesList.map(element => {
                return {
                    name: element.name,
                    description: element.description,
                    url: element.url,
                    roles: element.roles,
                    isAdminModule: (element.isAdminModule) ? 'Yes' : 'No',
                    isVisible: (element.isVisible) ? 'Yes' : 'No',
                    isRootModule: (element.isRootModule) ? 'Yes' : 'No',
                    rootModule: (element.rootModuleId != null) ? modulesList.filter(module => (module.id == element.rootModuleId)).map(module => module.name)[0] : '-----',
                    icon: (element.icon) ? element.icon : '-----',
                    isadminmodule: element.isAdminModule,
                    isvisible: element.isVisible,
                    isrootmodule: element.isRootModule,
                    rootmoduleid: element.rootModuleId,
                    id: element.id
                }
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "result": response,
                "responseCode": 'OK',
                "response": "Modules Fetched Successfully"
            })
        } else {
            loggerUtil.generateLogger(
                "info",
                "{{RESPONSE}} ===> No modules found",
                "getAllModules",
                "Get All Modules",
                data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "result": [],
                "responseCode": 'OK',
                "response": "No Modules Found"
            });
        }
    } catch (error) {
        loggerUtil.generateLogger(
            "error",
            "{{ERROR}} ===> ERROR IN getAllModules :::" +
            JSON.stringify(error),
            "getAllModules",
            "Get All Modules",
            data
        );
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 500,
            "responseCode": 'ERROR',
            "error": error
        });
    }
};

const createModule = async (req, res) => {
    let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    try {
        loggerUtil.generateLogger(
            "info",
            "{{REQUEST}} ===>" + JSON.stringify(req.body),
            "createModule",
            "Create Module",
            data
        );
        const result = await getDBResponse(_constants.INSERT_TO_MODULES, Object.values(req.body), data);

        if (result) {
            loggerUtil.generateLogger(
                "info",
                "{{RESPONSE}} ===> MODULE CREATED IN DB SUCCESSFULLY",
                "createModule",
                "Create Module",
                data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": 'OK',
                "response": "Module Created Successfully"
            });
        } else {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN createModule :::" +
                JSON.stringify(result),
                "createModule",
                "Create Module",
                data
            );
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": 'ERROR',
                "error": "Error in creating the module"
            });
        }
    } catch (error) {
        loggerUtil.generateLogger(
            "error",
            "{{ERROR}} ===> ERROR IN createModule :::" +
            JSON.stringify(error),
            "createModule",
            "Create Module",
            data
        );
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 500,
            "responseCode": 'OK',
            "error": "Error in creating the module"
        })
    }
};

const updateModule = async (req, res) => {
    let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    try {
        loggerUtil.generateLogger(
            "info",
            "{{REQUEST}} ===>" + JSON.stringify(req.body),
            "updateModule",
            "Update Module",
            data
        );
        const result = await getDBResponse(`UPDATE MODULES SET name = '${req.body.name}', description = '${req.body.description}', url = '${req.body.url}', roles = '${req.body.roles}', icon = null, isVisible = ${req.body.isVisible}, isAdminModule = ${req.body.isAdminModule}, isRootModule = ${req.body.isRootModule}, rootModuleId = ${req.body.rootModuleId || null} WHERE id = ${req.body.id}`, '', data);

        if (result.affectedRows > 0) {
            loggerUtil.generateLogger(
                "info",
                "{{RESPONSE}} ===> MODULE UPDATED TO DB SUCCESSFULLY",
                "updateModule",
                "Update Module",
                data
            );

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": 'OK',
                "response": "Module Updated Successfully"
            });
        } else {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN updateModule :::" +
                JSON.stringify(result),
                "updateModule",
                "Update Module",
                data
            );
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": 'ERROR',
                "error": "Error in deleting the module"
            });
        }

    } catch (error) {
        loggerUtil.generateLogger(
            "error",
            "{{ERROR}} ===> ERROR IN updateModule :::" +
            JSON.stringify(error),
            "updateModule",
            "Update Module",
            data
        );
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 500,
            "responseCode": 'ERROR',
            "error": error
        });
    }
};

const deleteModule = async (req, res) => {
    let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    try {
        loggerUtil.generateLogger(
            "info",
            "{{REQUEST}} ===>" + JSON.stringify(req.body),
            "deleteModule",
            "Delete Module",
            data
        );

        const result = await getDBResponse(_constants.DELETE_MODULE, req.params.id, data);

        if (result.affectedRows > 0) {
            loggerUtil.generateLogger(
                "info",
                "{{RESPONSE}} ===> Module DELETED FROM DB SUCCESSFULLY",
                "deleteModule",
                "Delete Module",
                data
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": "OK",
                "response": "Module Deleted Successfully"
            });
        } else {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN deleteModule :::" +
                JSON.stringify(result),
                "deleteModule",
                "Delete Module",
                data
            );
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "responseCode": "ERROR",
                "error": "Error in deleting the module"
            })
        }
    } catch (error) {
        loggerUtil.generateLogger(
            "error",
            "{{ERROR}} ===> ERROR IN deleteModule :::" +
            JSON.stringify(error),
            "deleteModule",
            "Delete Module",
            data
        );
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
            "statusCode": 500,
            "responseCode": "ERROR",
            "error": "Error in deleting the module"
        })
    }
};

const readModule = async (req, res) => {
    let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid }, modulesList;
    try {
        loggerUtil.generateLogger(
            "info",
            "{{REQUEST}} ===> READ MODULE",
            "readModule",
            "READ Module",
            data
        );
        modulesList = getDBResponse(_constants.GET_MODULE, req.params.id, data);
        try {
            if (modulesList.length > 0) {
                loggerUtil.generateLogger(
                    "info",
                    "{{RESPONSE}} ===> MODULE RETRIEVED",
                    "readModule",
                    "Read Module",
                    data
                );
                resolve({
                    responseCode: 200,
                    result: modulesList
                });
            } else {
                loggerUtil.generateLogger(
                    "info",
                    "{{RESPONSE}} ===> No user entries found",
                    "readModule",
                    "Read Module",
                    data
                );
                resolve({
                    responseCode: 201,
                    result: "No module entries found"
                });
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN readModule :::" +
                JSON.stringify(error),
                "readModule",
                "Read Module",
                data
            );
            reject(error);
        }
    } catch (error) {
        loggerUtil.generateLogger(
            "error",
            "{{ERROR}} ===> ERROR IN readModule :::" +
            JSON.stringify(error),
            "readModule",
            "Read Module",
            data
        );
        reject(error);
    }
}

const getDBResponse = function (query, value, data) {
    return new Promise(function (resolve, reject) {
        loggerUtil.generateLogger("info", "{{REQUEST}}", "DB Request =====> " + query + ":::::" + JSON.stringify(value), "ModulesController", data);
        pool.query(query, value, function (err, results, fields) {
            if (err) {
                loggerUtil.generateLogger("error", "{{ERROR}}", "COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + JSON.stringify(value), "ModulesController", data);
                reject("COULD NOT RETRIEVE DB VALUE FOR " + query + ":::::" + JSON.stringify(value));
            }

            loggerUtil.generateLogger("info", "{{RESPONSE}}", "RETRIEVED DB VALUE =====>" + JSON.stringify(results), "ModulesController", data);

            resolve(results);
        });
    })
}

module.exports = {
    getAllModules,
    createModule,
    updateModule,
    deleteModule,
    readModule,
    // getSubModules
};