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
const loggerUtil = require("../../../utils/loggerUtil");
var queries = require("../../../utils/queries");
const nodemailer = require("nodemailer");
const sendMail = require("../sendMail/index.controller");
/**
 * Initialization Framework, exposing the
 * request and response to each other, as well as reading an excel file.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 *
 */

const getSupportUsersList = async req => {
    return new Promise(async function (resolve, reject) {
        let data = req.body;
        try {
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===> GET ALL SUPPORT USER DETAILS",
                "getOrgList",
                "Get Ecreds Org List",
                data
            );
            let usersList = await queries.fetchSupportUsersList(data);
            try {
                if (usersList.length > 0) {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> SUPPORT USER DETAILS RETRIEVED",
                        "getSupportUsersList",
                        "Get Support Users List",
                        data
                    );
                    resolve({
                        responseCode: 200,
                        result: usersList
                    });
                } else {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> No user entries found",
                        "getSupportUsersList",
                        "Get Support Users List",
                        data
                    );
                    resolve({
                        responseCode: 200,
                        result: "No user entries found"
                    });
                }
            } catch (error) {
                loggerUtil.generateLogger(
                    "error",
                    "{{ERROR}} ===> ERROR IN getSupportUsersList :::" +
                    JSON.stringify(error),
                    "getSupportUsersList",
                    "Get Support Users List",
                    data
                );
                reject(error);
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN getSupportUsersList :::" +
                JSON.stringify(error),
                "getSupportUsersList",
                "Get Support Users List",
                data
            );
            reject(error);
        }
    });
};

const insertIntoSupportUsersList = async req => {
    return new Promise(async function (resolve, reject) {
        let data = req.body;
        try {
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===>"+JSON.stringify(req.body),
                "insertIntoSupportUsersList",
                "insert Into Support Users List",
                data
            );
            let usersList = await queries.insertEntriesIntoUserInfo(req.body);
            try {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> SUPPORT USER INSERTED TO DB SUCCESSFULLY",
                        "insertIntoSupportUsersList",
                        "Insert Into Support Users List",
                        data
                    );
                    resolve({
                        responseCode: 200,
                        result: "User Inserted Successfully"
                    });                   
                
            } catch (error) {
                loggerUtil.generateLogger(
                    "error",
                    "{{ERROR}} ===> ERROR IN insertIntoSupportUsersList :::" +
                    JSON.stringify(error),
                    "insertIntoSupportUsersList",
                    "Insert Into Support Users List",
                    data
                );
                reject(error);
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN getSupportUsersList :::" +
                JSON.stringify(error),
                "insertIntoSupportUsersList",
                "Insert Into Support Users List",
                data
            );
            reject(error);
        }
    });
};

const deleteFromSupportUsersList = async req => {
    return new Promise(async function (resolve, reject) {
        let data = req.body;
        let temp = { userId: data.uid, userName : data.uname};
        try {
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===>"+JSON.stringify(req.body),
                "deleteFromSupportUsersList",
                "Delete from Support Users List",
                data
            );
            let usersList = await queries.DeleteFromUserInfo(req.body, temp);
            try {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> SUPPORT USER DELETED FROM DB SUCCESSFULLY",
                        "deleteFromSupportUsersList",
                        "Delete from Support Users List",
                        data
                    );
                    resolve({
                        responseCode: 200,
                        result: "User Deleted Successfully"
                    });
                
            } catch (error) {
                loggerUtil.generateLogger(
                    "error",
                    "{{ERROR}} ===> ERROR IN deleteFromSupportUsersList :::" +
                    JSON.stringify(error),
                    "deleteFromSupportUsersList",
                    "Delete from Support Users List",
                    data
                );
                reject(error);
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                    "{{ERROR}} ===> ERROR IN deleteFromSupportUsersList :::" +
                    JSON.stringify(error),
                    "deleteFromSupportUsersList",
                    "Delete from Support Users List",
                    data
            );
            reject(error);
        }
    });
};

const fetchIndividualSupportUser = async req => {
    return new Promise(async function (resolve, reject) {
        let data = req.body;
        let temp1 = {userId : data.userId || "", userName : data.userId || ""};
        try {
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===> GET INDIVIDUAL SUPPORT USER DETAILS",
                "fetchIndividualSupportUser",
                "Fetch Individual Support User",
                temp1
            );
            let usersList = await queries.fetchSingleSupportUser(req.body,temp1);
            try {
                if (usersList.length > 0) {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> SUPPORT USER DETAILS RETRIEVED",
                        "getSupportUsersList",
                        "Get Support Users List",
                        temp1
                    );
                    resolve({
                        responseCode: 200,
                        result: usersList
                    });
                } else {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> No user entries found",
                        "getSupportUsersList",
                        "Get Support Users List",
                        temp1
                    );
                    resolve({
                        responseCode: 201,
                        result: "No user entries found"
                    });
                }
            } catch (error) {
                loggerUtil.generateLogger(
                    "error",
                    "{{ERROR}} ===> ERROR IN getSupportUsersList :::" +
                    JSON.stringify(error),
                    "getSupportUsersList",
                    "Get Support Users List",
                    temp1
                );
                reject(error);
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN getSupportUsersList :::" +
                JSON.stringify(error),
                "getSupportUsersList",
                "Get Support Users List",
                temp1
            );
            reject(error);
        }
    });
}

const updateUserInSupportUsersList = async req => {
    return new Promise(async function (resolve, reject) {
        let data = req.body;
        try {
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===>"+JSON.stringify(req.body),
                "updateUserInSupportUsersList",
                "update User In Support Users List",
                data
            );
            let usersList = await queries.updateUserEntryInUserInfo(req.body);
            try {
                    loggerUtil.generateLogger(
                        "info",
                        "{{RESPONSE}} ===> SUPPORT USER UPDATED TO DB SUCCESSFULLY",
                        "updateUserInSupportUsersList",
                        "update User In Support Users List",
                        data
                    );
                    resolve({
                        responseCode: 200,
                        result: "User Data Updated Successfully"
                    });
                
            } catch (error) {
                loggerUtil.generateLogger(
                    "error",
                    "{{ERROR}} ===> ERROR IN updateUserInSupportUsersList :::" +
                    JSON.stringify(error),
                    "updateUserInSupportUsersList",
                    "update User In Support Users List",
                    data
                );
                reject(error);
            }
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN updateUserInSupportUsersList :::" +
                JSON.stringify(error),
                "updateUserInSupportUsersList",
                "update User In Support Users List",
                data
            );
            reject(error);
        }
    });
};

module.exports = {
    getSupportUsersList,
    insertIntoSupportUsersList,
    deleteFromSupportUsersList,
    fetchIndividualSupportUser,
    updateUserInSupportUsersList
};
