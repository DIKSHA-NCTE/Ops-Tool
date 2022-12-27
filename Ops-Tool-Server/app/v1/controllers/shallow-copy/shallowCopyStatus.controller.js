const express = require('express');
const async = require('async');
const http = require('http');
const path = require('path');
const request = require('request');
const XLSX = require('xlsx');
const _ = require('lodash');
const appRoot = require('app-root-path');
const fs = require('fs');
const uuidV1 = require('uuid/v1');
const { performance } = require('perf_hooks');
const logger = require('../../../../config/winston');
var pool = require('../../../../config/database');

var strFilePath = `${appRoot}/uploads/input/`;


const shallowCopyContentStatus = (req, res) => {
    let type = req.body.checkStatus;
    let query = [], bulkQuery = [];
    let userInfo, batchStatus = "completed", contentStatus, process_id, channel;

    if (req.body.hasOwnProperty('channel')) {
        channel = req.body.channel;
        query.push("channelId='" + channel + "'");
        bulkQuery.push("channelId='" + channel + "'")
    }
    if (req.body.hasOwnProperty('processId')) {
        process_id = req.body.processId;
        query.push("batch_processId='" + process_id + "'");
        bulkQuery.push("processId='" + process_id + "'");
    }

    if (req.body.hasOwnProperty('batchStatus')) {
        batchStatus = req.body.batchStatus;
        bulkQuery.push("status='" + batchStatus + "'");
    }

    if (req.body.hasOwnProperty('contentStatus')) {
        contentStatus = req.body.contentStatus;
        query.push("status='" + contentStatus + "'");
    }

    if (req.body.hasOwnProperty('userInfo')) {
        userInfo = req.body.userInfo;
        query.push("userName='" + userInfo + "'");
    }

    let a = query.join(" AND ");
    let b = bulkQuery.join(" AND ");
    let sqlStmt = "";
    let bulkStmt = "";
    if (type == "batchJob") {
        bulkStmt = "SELECT * FROM CONTENT_SHALLOW_COPY WHERE " + b;
        sqlStmt = `SELECT * FROM SHALLOW_CONTENT_INFO WHERE ` + a;
    } else if (type == "contents") {
        sqlStmt = `SELECT * FROM SHALLOW_CONTENT_INFO WHERE ` + a;
    }

    if (type == "batchJob") {
        pool.query(bulkStmt, function (er, rs) {
            pool.query(sqlStmt, function (err, result) {
                if (err) {
                    res.statusCode = 500;
                    return res.json({
                        "status": 500, "error": 'Could not retrieve status', "response": null
                    });
                }

                if (result && result.length == 0) {
                    res.statusCode = 200;
                    return res.json({
                        "status": 404, "error": 'No contents uploaded under this category.', "response": null
                    });
                }
                let filePath = result[0]['excelPath'];
                try {
                    return res.json({
                        status: 200,
                        response: result,
                        file: filePath
                    })
                } catch (err) {
                    logger.error(err);
                    res.statusCode = 500;
                    res.json({
                        "status": 500, "error": err, "response": null
                    });
                }
            })
        })
    } else if (type == "contents") {
        pool.query(sqlStmt, function (err, result) {
            if (err) {
                res.statusCode = 500;
                return res.json({
                    "status": 500, "error": 'Could not retrieve status', "response": null
                });
            }

            if (result && result.length == 0) {
                res.statusCode = 200;
                return res.json({
                    "status": 404, "error": 'No contents uploaded under this category.', "response": null
                });
            }

            return res.json({
                status: 200,
                response: result
            })
        });
    }
}

const shallowCopyBatchStatusList = (req, res) => {
    let type = req.body.checkStatus;
    let query = [], bulkQuery = [];
    let userInfo, batchStatus = "completed", contentStatus, process_id, channel;

    if (req.body.hasOwnProperty('channel')) {
        channel = req.body.channel;
        query.push("channelId='" + channel + "'");
        bulkQuery.push("channelId='" + channel + "'")
    }

    if (req.body.hasOwnProperty('batchStatus')) {
        batchStatus = req.body.batchStatus;
        query.push("status='" + batchStatus + "'");
        bulkQuery.push("status='" + batchStatus + "'");
    }

    if (!req.body.hasOwnProperty('batchStatus') && type == "batchJob") {
        bulkQuery.push("status='completed'");
    }

    if (req.body.hasOwnProperty('userInfo')) {
        userInfo = req.body.userInfo;
        bulkQuery.push("userInfo='" + userInfo + "'");
    }

    let b = bulkQuery.join(" AND ");
    let sqlStmt = "";
    sqlStmt = "SELECT * FROM CONTENT_SHALLOW_COPY WHERE " + b;

    //let selectSql = `SELECT * FROM CONTENT_BULK_UPLOAD WHERE channelId = '${channelId}' ORDER BY createdAt DESC`;
    pool.query(sqlStmt, function (err, result) {
        if (err) {
            res.statusCode = 500;
            return res.json({
                "status": 502, "error": 'Could not retrieve status list', "response": null
            });
        }

        res.statusCode = 200;
        res.json({
            "status": 200, "error": null, "response": result
        });

    });
}

module.exports = { shallowCopyContentStatus, shallowCopyBatchStatusList }