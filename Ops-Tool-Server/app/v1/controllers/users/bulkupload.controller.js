const csv = require('csv-parser');
const fs = require('fs');
const appRoot = require('app-root-path');
const _users = require("./users.controller");
var common = require('../../../routes/common');
var config = common.config();
var apiConfig = require('../../../../config/api.config.json');
var request = require('request');
const async = require('async');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var path = require('path');
const http = require("http");
const uuidV4 = require("uuid/v4");
const userQueries = require("./queries");
const _CONST = require("../../../../config/constants");
var pool = require('../../../../config/database');
var logger = require("../../../utils/loggerUtil");
const blacklistedDomains = require('../../../../blacklisted-domains');

const readUploadCSVdata = async (req, res) => {
    let token = req.body["access_token"];
    let data = `${appRoot}/` + req.file.path,
        channel = req.body.channel, adminEmail = req.body.adminDetails;
    let csvData = [];
    let existingUsersCSV = {
    };
    let invalidNewUsersCSV = {};
    let dbReq = {
        batchId: uuidV4(),
        processId: '',
        adminEmail: adminEmail,
        channelId: channel,
        existingUsersCsv: '',
        invalidNewUsersCSV: '',
        newUsersCSV: '',
        comments: '',
        status: 'pending',
        failureReason: '',
        CSVPath: data
    }, temp = {
        userId: "",
        userName: adminEmail
    };

    let dbVal = {};
    userQueries.insertUserBulkRequest(dbReq, temp)
        .then(async function (uploadDBResponse) {
            await pool.query(_CONST.GET_BULK_REQUEST_ENTRY, uploadDBResponse, function (err, results) {
                if (err) {
                    logger.generateLogger("error", "{{RESPONSE}}", "COULD NOT RETRIEVE DB ENTRY AFTER USER UPLOAD CREATION", "readUploadCSVdata", temp);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "status": 500, "error": 'Could not retrieve data after insert, error in executing the batch process', "response": null
                    });
                }

                logger.generateLogger("info", "{{RESPONSE}}", "RETRIEVE USER_BULK_UPLOAD SQL DB ENTRY=====>" + JSON.stringify(results), "readUploadCSVdata", temp);
                dbVal['id'] = results[0].id;
                dbVal['batchId'] = results[0].batchId;
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "status": 200, "response": results[0].batchId, "error": null
                });
            });
            fs.createReadStream(data)
                .pipe(csv())
                .on('data', (row) => {
                    csvData.push(row);
                })
                .on('end', async () => {
                    logger.generateLogger("info", "{{DATA}}", "CSV parsed successfully", "readUploadCSVdata", temp);
                    let processedValues = await processCSVData(csvData, token);
                    try {
                        if (processedValues['existingUsersList'].length > 0) {
                            existingUsersCSV = await writeExistingUsersCSVfile(req.file, processedValues['existingUsersList']);
                            logger.generateLogger("info", "{{RESPONSE}}", "Existing users list written to csv === File Path ==" + existingUsersCSV['filePath'], "readUploadCSVdata", temp);
                        }

                        if (processedValues['invalidNewUserList'].length > 0) {
                            invalidNewUsersCSV = await writeInvalidNewUsersCSVfile(req.file, processedValues['invalidNewUserList']);
                            logger.generateLogger("info", "{{RESPONSE}}", "Invalid new users list written to csv === File Path ==" + invalidNewUsersCSV['filePath'], "readUploadCSVdata", temp);
                        }

                        if (processedValues['newUsersList'].length > 0) {
                            let newUsersCSV = await writeNewUsersCSVfile(req.file, processedValues['newUsersList']);
                            if (newUsersCSV) {
                                logger.generateLogger("info", "{{REQUEST}}", "Bulk upload new users list to backend === File Path ==" + newUsersCSV['filePath'], "readUploadCSVdata", temp);
                                let uploadResponse = await bulkUserUpload(newUsersCSV['filePath'], token);
                                try {
                                    if (uploadResponse['statusCode'] == 200) {
                                        uploadResponse['existingUsersFile'] = existingUsersCSV['filePath'];
                                        uploadResponse['invalidNewUsersFile'] = invalidNewUsersCSV['filePath'];
                                        logger.generateLogger("info", "{{RESPONSE}}", "Bulk upload new users list response with existing users csv ===" + JSON.stringify(uploadResponse), "readUploadCSVdata", temp);

                                        let a = [existingUsersCSV['filePath'], invalidNewUsersCSV['filePath'], newUsersCSV['filePath'], "Bulk users uploaded successfully", uploadResponse['response']['result']['processId'], dbVal['batchId'], dbVal['id']];
                                        userQueries.updatePassRequest(a, temp)
                                            .then(function (response) {
                                            }, function (error) {
                                            });

                                    } else {
                                        logger.generateLogger("info", "{{RESPONSE}}", "Bulk upload new users list response without existing users csv ===" + JSON.stringify(uploadResponse), "readUploadCSVdata", temp);

                                        let a = [existingUsersCSV['filePath'], invalidNewUsersCSV['filePath'], "", "No new users for bulk upload process", "", dbVal['batchId'], dbVal['id']];
                                        userQueries.updatePassRequest(a, temp)
                                            .then(function (response) {
                                            }, function (error) {
                                            });
                                    }
                                } catch (upEr) {
                                    let a = [existingUsersCSV['filePath'], invalidNewUsersCSV['filePath'], newUsersCSV['filePath'], "Bulk upload new users list error ===`'${JSON.stringify(upEr)}'`", dbVal['batchId'], dbVal['id']];
                                    userQueries.updateFailRequest(a, temp)
                                        .then(function (response) {
                                        }, function (error) {
                                        });
                                    logger.generateLogger("error", "{{ERROR}}", "Bulk upload new users list error ===" + JSON.stringify(upEr), "readUploadCSVdata", temp);
                                }
                            }
                        } else {
                            let a = [existingUsersCSV['filePath'], invalidNewUsersCSV['filePath'], "", "No new users for bulk upload process", "", dbVal['batchId'], dbVal['id']];
                            userQueries.updatePassRequest(a, temp)
                                .then(function (response) {
                                }, function (error) {
                                });
                        }
                    } catch (er) {
                        let a = ["", "", "", JSON.stringify(er), dbVal['batchId'], dbVal['id']];
                        userQueries.updateFailRequest(a, temp)
                            .then(function (response) {
                            }, function (error) {
                            });
                        logger.generateLogger("error", "{{ERROR}}", "processed values error ===" + JSON.stringify(er), "readUploadCSVdata", temp);
                    }
                });
        }, function (error) {
            logger.generateLogger("error", "{{ERROR}}", "DB insert error ===" + JSON.stringify(error), "readUploadCSVdata", temp);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return error;
        })
}

const processCSVData = async (req, token) => {
    return new Promise(function (resolve, reject) {
        let existingUserData = [], newUserData = [], invalidNewUserData = [];
        async.eachSeries(req, async function (row, callback) {
            let request = {
                'request': {
                    'filters': {
                    },
                    'fields': [
                    ],
                    'sort_by': {
                        'createdDate': 'desc'
                    },
                    'offset': 0,
                    'limit': 10000
                }
            };

            let data = {
                body: {
                    userId: "",
                    userName: "",
                    token: token
                }
            }

            let noEmail = false, noPhone = false;
            if (row['EMAIL']) {
                if (request.request.filters['MOBILE PHONE']) {
                    delete request.request.filters['MOBILE PHONE'];
                }
                request.request.filters['email'] = row['EMAIL'].toLowerCase();
                data.body['request'] = request;
                let response = await searchUsersList(data);
                try {
                    if (response.response.responseCode === 'OK' && response.response.result.response.content.length > 0) {
                        response.response.result.response.content.forEach(el => {
                            existingUserData.push({
                                "NAME": row["NAME"],
                                "MOBILE PHONE": row["MOBILE PHONE"],
                                "EMAIL": row["EMAIL"],
                                "SCHOOL ID": row["SCHOOL ID"],
                                "USER_TYPE": row["USER_TYPE"],
                                "ROLES": el.roles,
                                "USER ID": el.identifier,
                                "CHANNEL": el.channel,
                                "ROOT ORG ID": el.rootOrgId,
                                "ROOT ORG NAME": el.rootOrgName,
                                "MESSAGE": "This user has already registered with email " + row['EMAIL'] + " for the org. " + el.rootOrgName + " (Org ID: " + el.rootOrgId + " )"
                            })
                        });
                    } else {
                        noEmail = true;
                    }
                } catch (er) {

                }
            }

            if (row['MOBILE PHONE']) {
                if (request.request.filters['email']) {
                    delete request.request.filters['email'];
                }
                request.request.filters['phone'] = row['MOBILE PHONE'].toLowerCase();
                data.body['request'] = request;
                let response = await searchUsersList(data);
                try {
                    if (response.response.responseCode === 'OK' && response.response.result.response.content.length > 0) {
                        response.response.result.response.content.forEach(el => {
                            existingUserData.push({
                                "NAME": row["NAME"],
                                "MOBILE PHONE": row["MOBILE PHONE"],
                                "EMAIL": row["EMAIL"],
                                "SCHOOL ID": row["SCHOOL ID"],
                                "USER_TYPE": row["USER_TYPE"],
                                "ROLES": el.roles,
                                "USER ID": el.identifier,
                                "CHANNEL": el.channel,
                                "ROOT ORG ID": el.rootOrgId,
                                "ROOT ORG NAME": el.rootOrgName,
                                "MESSAGE": "This user has already registered with phone number " + row['MOBILE PHONE'] + " for the org. " + el.rootOrgName + " (Org ID: " + el.rootOrgId + " )"
                            })
                        });
                    } else {
                        noPhone = true;
                    }
                } catch (er) {
                }
            }
            if(!row['EMAIL'] && !row['MOBILE PHONE']) {
                invalidNewUserData.push({
                    "NAME": row["NAME"],
                    "MOBILE PHONE": row["MOBILE PHONE"],
                    "EMAIL": row["EMAIL"],
                    "SCHOOL ID": row["SCHOOL ID"],
                    "USER_TYPE": row["USER_TYPE"],
                    "ROLES": row['ROLES'],
                    "USER ID": "",
                    "MESSAGE": "Required identifier email and/or mobile no. is missing"
                });
            }

            if (noEmail || noPhone) {
                let isValidUser = true;
                let message = '';

                /* check if email domail is valid */
                const email = row["EMAIL"];
                if (email) {
                    const [, emailDomain] = email.match(/@(.*)/) || [];
                    if (blacklistedDomains.includes(emailDomain)) {
                        message = 'Invalid domain used for email';
                        isValidUser = false;
                    }
                }
                //

                if (isValidUser) {
                    newUserData.push({
                        "NAME": row["NAME"],
                        "MOBILE PHONE": row["MOBILE PHONE"],
                        "EMAIL": row["EMAIL"],
                        "SCHOOL ID": row["SCHOOL ID"],
                        "USER_TYPE": row["USER_TYPE"],
                        "ROLES": row['ROLES'],
                        "USER ID": "",
                    });
                } else {
                    invalidNewUserData.push({
                        "NAME": row["NAME"],
                        "MOBILE PHONE": row["MOBILE PHONE"],
                        "EMAIL": row["EMAIL"],
                        "SCHOOL ID": row["SCHOOL ID"],
                        "USER_TYPE": row["USER_TYPE"],
                        "ROLES": row['ROLES'],
                        "USER ID": "",
                        "MESSAGE": message
                    });
                }

            }

        }, function (error, result) {
            resolve({
                existingUsersList: existingUserData,
                newUsersList: newUserData,
                invalidNewUserList: invalidNewUserData
            });
        });
    });
}

const writeExistingUsersCSVfile = async (file, data) => {
    return new Promise(async function (resolve, reject) {
        var extension = path.extname(file.originalname);
        var filePath = path.basename(file.originalname, extension);
        var val = filePath + "_Existing_USERS_DATA" + '_' + Date.now() + extension;
        var id = `${appRoot}/uploads/csvOutput/` + val;
        const csvWriter = createCsvWriter({
            path: id,
            header: [
                { id: "NAME", title: "NAME" },
                { id: "MOBILE PHONE", title: "MOBILE PHONE" },
                { id: "EMAIL", title: "EMAIL" },
                { id: "SCHOOL ID", title: "SCHOOL ID" },
                { id: "USER_TYPE", title: "USER_TYPE" },
                { id: "ROLES", title: "ROLES" },
                { id: "USER ID", title: "USER ID" },
                { id: "CHANNEL", title: "CHANNEL" },
                { id: "ROOT ORG ID", title: "ROOT ORG ID" },
                { id: "ROOT ORG NAME", title: "ROOT ORG NAME" },
                { id: "MESSAGE", title: "MESSAGE" }
            ]
        });
        csvWriter
            .writeRecords(data)
            .then(() => {
                resolve({ filePath: val });
            });
    });
};

const writeInvalidNewUsersCSVfile = async (file, data) => {
    return new Promise(async function (resolve, reject) {
        var extension = path.extname(file.originalname);
        var filePath = path.basename(file.originalname, extension);
        var val = filePath + "_INVALID_NEW_USERS_DATA" + '_' + Date.now() + extension;
        var id = `${appRoot}/uploads/csvOutput/` + val;
        const csvWriter = createCsvWriter({
            path: id,
            header: [
                { id: "NAME", title: "NAME" },
                { id: "MOBILE PHONE", title: "MOBILE PHONE" },
                { id: "EMAIL", title: "EMAIL" },
                { id: "SCHOOL ID", title: "SCHOOL ID" },
                { id: "USER_TYPE", title: "USER_TYPE" },
                { id: "ROLES", title: "ROLES" },
                { id: "USER ID", title: "USER ID" },
                { id: "MESSAGE", title: "MESSAGE" }
            ]
        });
        csvWriter
            .writeRecords(data)
            .then(() => {
                resolve({ filePath: val });
            });
    });
};

const writeNewUsersCSVfile = async (file, data) => {
    return new Promise(async function (resolve, reject) {
        var extension = path.extname(file.originalname);
        var filePath = path.basename(file.originalname, extension);
        var id = `${appRoot}/uploads/csvOutput/` + filePath + "_New_USERS_DATA" + '_' + Date.now() + extension;
        const csvWriter = createCsvWriter({
            path: id,
            header: [
                { id: "NAME", title: "NAME" },
                { id: "MOBILE PHONE", title: "MOBILE PHONE" },
                { id: "EMAIL", title: "EMAIL" },
                { id: "SCHOOL ID", title: "SCHOOL ID" },
                { id: "USER_TYPE", title: "USER_TYPE" },
                { id: "ROLES", title: "ROLES" },
                { id: "USER ID", title: "USER ID" },
            ]
        });
        csvWriter
            .writeRecords(data)
            .then(() => {
                console.log('The CSV file was written successfully');
                resolve({ filePath: id });
            });
    });
};

const searchUsersList = (req) => {
    let data = req.body;

    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.SEARCH,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': data.token
        },
        body: data.request,
        json: true
    }
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error != null) {
                reject({
                    "statusCode": 500,
                    "error": error.error,
                    "error_description": error.error_description
                });
            } else {
                if (!error && body) {
                    if (body.params.status == 'SUCCESS') {
                        // // logger.generate// // logger("info","{{SUCCESS}} ===> USERS LIST FETCHED SUCCESSFULLY ::: "+JSON.stringify(body),"USERS ACTIONS","SEARCH USERS LIST RESPONSE",data);
                        resolve({
                            "statusCode": 200,
                            "response": body
                        })
                    } else {
                        // // logger.generate// // logger("info","{{SUCCESS}} ===> USERS LIST FETCHED SUCCESSFULLY ::: "+JSON.stringify(body),"USERS ACTIONS","SEARCH USERS LIST RESPONSE",data);
                        reject({
                            "statusCode": 200,
                            "response": body
                        })
                    }

                } else {
                    // // logger.generate// // logger("error","{{ERROR}} ===> UNABLE TO FETCH USERS LIST ::: "+JSON.stringify(body),"USERS ACTIONS","SEARCH USERS LIST RESPONSE",data);
                    reject({
                        "statusCode": 400,
                        "error": "Unable to fetch the user details",
                        "error_description": "Unable to fetch the user details"
                    });
                }
            }
        });
    });
}

const bulkUserUpload = (req, token) => {
    var options = {
        method: 'POST',
        url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.USER + apiConfig.SUB_URL.V1 + apiConfig.APIS.UPLOAD,
        headers: {
            'Authorization': config.API_KEY,
            'x-authenticated-user-token': token
        },
        formData: {
            user: fs.createReadStream(req),
        }
    }

    // logger.generate// logger("info","{{REQUEST}} ===>"+JSON.stringify(options),"USERS ACTIONS","BULK USER UPLOAD REQUEST",{userId: "", userName: ""});
    return new Promise(async function (resolve, reject) {
        request(options, function (error, response, body) {
            let bodyData = JSON.parse(body);
            if (error != null) {
                // logger.generate// logger("ERROR","{{ERROR}} ===> ERROR IN UPLOADING USERS ::: "+JSON.stringify(error),"USERS ACTIONS","BULK USER UPLOAD RESPONSE",{userId: "", userName: ""});
                reject({
                    "statusCode": 500,
                    "error": error.error,
                    "error_description": error.error_description
                })
            } else {
                if (!error && bodyData.responseCode == "OK") {
                    if (bodyData['params']['status'] == 'SUCCESS') {
                        // logger.generate// logger("info","{{SUCCESS}} ===> BULK USERS UPLOADED SUCCESSFULLY ::: "+JSON.stringify(body),"USERS ACTIONS","BULK USER UPLOAD RESPONSE",{userId: "", userName: ""});
                        resolve({
                            "statusCode": 200,
                            "response": bodyData
                        })
                    } else {
                        // logger.generate// logger("info","{{SUCCESS}} ===> BULK USERS UPLOADED SUCCESSFULLY ::: "+JSON.stringify(body),"USERS ACTIONS","BULK USER UPLOAD RESPONSE",{userId: "", userName: ""});
                        reject({
                            "statusCode": 400,
                            "response": bodyData
                        })
                    }

                } else {
                    // logger.generate// logger("error","{{ERROR}} ===> UNABLE TO UPLOAD BULK USERS ::: "+JSON.stringify(body),"USERS ACTIONS","BULK USER UPLOAD RESPONSE",{userId: "", userName: ""});
                    reject({
                        "statusCode": 400,
                        "error": "Unable to upload bulk users",
                        "error_description": "Unable to upload bulk users"
                    })
                }
            }
        });
    });

};


const fetchDBEntryByProcessId = (req, data) => {
    return new Promise(function (resolve, reject) {
        userQueries.fetchEntryFromDB(req, data)
            .then(function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
    })
}

const getBulkUploadStatus = async (req, res) => {
    let reqBody = req.body;
    let data = JSON.parse(reqBody.metaInfo);
    let token = req.body["access_token"];
    await fetchDBEntryByProcessId(reqBody.id, { userId: "", userName: "" })
        .then(async function (resp) {
            logger.generateLogger("info", "{{RESPONSE}}", "FETCH USER_BULK_UPLOAD SQL DB ENTRY=====>" + JSON.stringify(resp), "fetchDBEntryByProcessId", data);

            let response = resp[0];
            if (response.processId != '' && response.newUsersCSV != '' && response.comments != '') {
                let temp = {
                    token: token,
                    id: response.processId
                }
                await fetchUploadStatus(temp, { userId: "", userName: "" })
                    .then(function (upLoadResp) {

                        if (response.existingUsersCsv != "" && response.existingUsersCsv != null) {
                            let a = `You can download the existing users list <a href="/csvOutput/${response.existingUsersCsv}">download here</a>`;
                            upLoadResp.existingUserCsv = a
                        }

                        if (response.invalidNewUsersCsv != "" && response.invalidNewUsersCsv != null) {
                            let b = `You can download the invalid new users list <a href="/csvOutput/${response.invalidNewUsersCsv}">download here</a>`;
                            upLoadResp.invalidNewUsersCsv = b;
                        }
                        logger.generateLogger("info", "{{RESPONSE}}", "FETCH USER_BULK_UPLOAD USERS STATUS=====>" + JSON.stringify(upLoadResp), "fetchUploadStatus", temp);

                        if (upLoadResp.statusCode == 200) {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                        } else {
                            res.statusCode = 400;
                            res.setHeader("Content-Type", "application/json");
                        }
                        return res.json(upLoadResp);
                    }, function (error) {
                        if (error.statusCode == 500) {
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                        } else {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                        }
                        return res.json(error);
                    })
            } else {
                if (response.status == 'success' && response.comments != '') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");

                    let responseData = {};
                    if (response.existingUsersCsv != '' && response.existingUsersCsv != null) {
                        responseData['existingUserCsv'] = `You can download the existing users list <a href="/csvOutput/${response.existingUsersCsv}" download>here</a>`;
                    }

                    if (response.invalidNewUsersCsv != '' && response.invalidNewUsersCsv != null) {
                        responseData['invalidNewUsersCsv'] = `You can download the invalid new users list <a href="/csvOutput/${response.invalidNewUsersCsv}">download here</a>`;
                    }

                    return res.json({
                        ...responseData,
                        statusCode: 200
                    })

                } else if (response.status == 'fail') {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        error: response.failureReason,
                        statusCode: 400
                    })
                }
            }
        }, function (error) {

        });
}

const fetchUploadStatus = (req, data) => {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: config.BASE + apiConfig.SUB_URL.API + apiConfig.APIS.UPLOADSTATUS + req.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.API_KEY,
                'x-authenticated-user-token': req.token
            },
            json: true
        }
        logger.generateLogger("info", "{{REQUEST}} ===>" + JSON.stringify(options), "USERS ACTIONS", "GET BULK USER UPLOAD STATUS REQUEST", data);

        request(options, function (error, response, body) {
            if (error != null) {
                logger.generateLogger("error", "{{ERROR}} ===> ERROR IN FETCHING BULK UPLOAD STATUS ::: " + JSON.stringify(error), "USERS ACTIONS", "GET BULK USER UPLOAD STATUS RESPONSE", data);
                reject({
                    "statusCode": 500,
                    "error": error.error,
                    "error_description": error.error_description
                })
            } else {
                if (!error && body) {
                    logger.generateLogger("info", "{{SUCCESS}} ===> FETCHING BULK UPLOAD STATUS SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "GET BULK USER UPLOAD STATUS RESPONSE", data);
                    if (body.params.status == 'SUCCESS') {
                        resolve({
                            "statusCode": 200,
                            "response": body
                        })
                    } else {
                        logger.generateLogger("info", "{{SUCCESS}} ===> FETCHING BULK UPLOAD STATUS SUCCESSFULLY ::: " + JSON.stringify(body), "USERS ACTIONS", "GET BULK USER UPLOAD STATUS RESPONSE", data);
                        resolve({
                            "statusCode": 400,
                            "response": body
                        })
                    }
                } else {
                    logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO FETCH BULK UPLOAD STATUS ::: " + JSON.stringify(body), "USERS ACTIONS", "GET BULK USER UPLOAD STATUS RESPONSE", data);
                    reject({
                        "statusCode": 400,
                        "error": "Unable to fetch the user details",
                        "error_description": "Unable to fetch the user details"
                    })
                }
            }
        });
    })
}

module.exports = { readUploadCSVdata, getBulkUploadStatus };