const express = require('express');
var request = require('request');
const loggerUtil = require("../../../utils/loggerUtil");
var path = require('path');
var async = require('async');
var cmd = require('node-cmd');
var fs = require('fs');
var common = require('../../../routes/common');
var config = common.config();
var apiConfig = require('../../../../config/api.config.json');

const readChannel = (req, user) => {
    return new Promise(function (resolve, reject) {
        try {
            let data = req;
            var options = {
                method: 'GET',
                url: config.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.CHANNEL + apiConfig.SUB_URL.V1 + apiConfig.APIS.READ + "/" + data.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': config.API_KEY,
                    'x-authenticated-user-token': data.token
                },
                body: {},
                json: true
            }
            loggerUtil.generateLogger(
                "info",
                "{{REQUEST}} ===>" + JSON.stringify(options),
                "readChannel",
                "Get channel related data",
                user
            );
            request(options, function (error, response, body) {
                if (error != null) {
                    loggerUtil.generateLogger(
                        "info",
                        "{{ERROR}} ===>" + JSON.stringify(error),
                        "readChannel",
                        "Get channel related data",
                        user
                    );
                    reject(error);
                } else {
                    if (!error && body) {
                        loggerUtil.generateLogger(
                            "info",
                            "{{SUCCESS}} ===> RESPONSE RETRIEVED",
                            "readChannel",
                            "Get channel related data",
                            user
                        );
                        if (body) {
                            resolve(body);
                        } else {
                            loggerUtil.generateLogger(
                                "info",
                                "{{SUCCESS}} ===> RESPONSE RETRIEVED",
                                "readChannel",
                                "Get channel related data",
                                user
                            );
                            resolve(body);

                        }

                    } else {
                        loggerUtil.generateLogger(
                            "info",
                            "{{ERROR}} ===>" + JSON.stringify(body),
                            "readChannel",
                            "Get channel related data",
                            user
                        );
                        reject(error);
                    }
                }
            });
        } catch (error) {
            loggerUtil.generateLogger(
                "error",
                "{{ERROR}} ===> ERROR IN readChannel :::" +
                JSON.stringify(error),
                "readChannel",
                "Get channel related data",
                user
            );
            reject(error);
        }
    });
};


module.exports = { readChannel };