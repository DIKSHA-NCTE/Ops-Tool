const express = require('express');
var request = require('request');
var logger = require('../../../../config/winston');
var path = require('path');
var async = require('async');
var cmd = require('node-cmd');
var fs = require('fs');
var common = require('../../../routes/common');
var config = common.config();
var apiConfig = require('../../../../config/api.config.json');

const readChannel = (req, res) => {
    let data = req.body;
    logger.info("********************===================READ CHANNEL REQUEST BEGINS FOR " + data.id + "===================********************");
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

    logger.info("READ CHANNEL REQUEST FOR " + data.id + "::: =====>" + JSON.stringify(options));

    request(options, function (error, response, body) {
        if (error != null) {
            logger.error("READ CHANNEL RESPONSE FOR " + data.id + "::: =====> Error in fetching the channel data for " + data.id + "----->" + JSON.stringify(error));
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            logger.error("________________________________________READ CHANNEL REQUEST ENDS FOR " + data.id + "________________________________________");
            return res.json({
                "statusCode": 500,
                "error": error.error,
                "error_description": error.error_description
            })
        } else {
            if (!error && body) {
                logger.info("READ CHANNEL RESPONSE FOR " + data.id + "::: =====>" + JSON.stringify(body.result.channel));
                if (body.params.status == 'successful') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    logger.info("________________________________________READ CHANNEL REQUEST ENDS FOR " + data.id + "________________________________________");
                    return res.json({
                        "statusCode": 200,
                        "response": body
                    })
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    logger.error("________________________________________READ CHANNEL REQUEST ENDS FOR " + data.id + "________________________________________");
                    return res.json({
                        "statusCode": 400,
                        "response": body
                    })
                }

            } else {
                logger.error("READ CHANNEL RESPONSE FOR " + data.id + "::: =====> Error in fetching the channel data for " + data.id + "----->" + JSON.stringify(body));
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


module.exports = { readChannel };