

const express = require("express");
const async = require("async");
const http = require("http");
const https = require("https");
const path = require("path");
const request = require("request");
const _ = require("lodash");
const { performance } = require("perf_hooks");
var common = require("../../../routes/common");
var config = common.config();
const logger = require("../../../utils/loggerUtil");
const statusArr = ['Pending', 'In Progress', 'Completed'];
const fs = require("fs");
var moment = require("moment");
const { BlobServiceClient } = require("@azure/storage-blob");
const appRoot = require('app-root-path');
const Axios = require('axios')
const ProgressBar = require('progress');
var token = process.env.EXHAUSTREPORTSAS;
const strFilePath = `${appRoot}/uploads/self-signup-user-reports/`;
const account = process.env.BLOB_ACCOUNT;
const containerName = "reports";
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${token}`);
var apiConfig = require('../../../../config/api.config.json');
var tenants = require("../organization/organization.controller");
var forms = require("../forms/index.controller");


const downloadReport = async (req, res) => {
  let reqHeader = req.headers, userData = { userName: reqHeader.username, userId: reqHeader.userid };
  logger.generateLogger("info", "{{REQUEST}} ===> " + req.body.slug, "DOWNLOAD SELF SIGNUP USER REPORT", "DOWNLOAD SELF SIGNUP USER REPORT REQUEST", userData);
    const downloadedFile = `${appRoot}/uploads/self-signup-user-reports/${req.body.slug}.csv`;
    const lastModified = fs.existsSync(downloadedFile) ? fs.statSync(downloadedFile).mtime.toLocaleDateString("en-US", {timeZone: 'Asia/Kolkata'}) : 0;
    if(lastModified === new Date().toLocaleDateString("en-US", {timeZone: 'Asia/Kolkata'})) {
      logger.generateLogger("info", "{{SUCCESS}} ===> " + req.body.slug, "DOWNLOAD SELF SIGNUP USER REPORT", "SELF SIGNUP USER REPORT DOWNLOADED SUCCESSFULLY", userData);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
            "statusCode": 200,
            "response": "File downloaded",
            "url": `/self-signup-user-reports/${req.body.slug}.csv`
            })
    } 
    else {
        if(fs.existsSync(downloadedFile)) {
            fs.unlinkSync(downloadedFile)
        }
        const blobName = `declared_user_detail/${req.body.slug}.csv`;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);
        const checkIfExists = await blobClient.exists();
        let url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}${token}`;
        if (checkIfExists == true) {
            console.log('Connecting …')
            const { data, headers } = await Axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            const totalLength = headers['content-length']
    
            console.log('Starting download')
            const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                width: 40,
                complete: '=',
                incomplete: ' ',
                renderThrottle: 1,
                total: parseInt(totalLength)
            })
    
            const writer = fs.createWriteStream(strFilePath + blobName.split('/')[1])
    
            data.on('data', (chunk) => progressBar.tick(chunk.length))
            data.pipe(writer)
            data.on('end', () => {
              logger.generateLogger("info", "{{SUCCESS}} ===> " + req.body.slug, "DOWNLOAD SELF SIGNUP USER REPORT", "SELF SIGNUP USER REPORT DOWNLOADED SUCCESSFULLY", userData);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                    "statusCode": 200,
                    "response": "File downloaded",
                    "url": '/self-signup-user-reports/' + blobName.split('/')[1]
                })
            });
        } else {
          logger.generateLogger("error", "{{ERROR}} ===> UNABLE TO DOWNLOAD SELF SIGNUP USER REPORT ::: " + 'File does not exist', "DOWNLOAD SELF SIGNUP USER REPORT", "DOWNLOAD SELF SIGNUP USER REPORT RESPONSE", userData);
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 400,
                "error": "File does not exist"
            })
        }
    }    
}

const getSsuFilter = (req) => {
    return new Promise(async function (resolve, reject) {
      try {
        let formResponse = await getFormResponse();
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
                      return { label: ele.orgName, value: ele.channel };
                    });
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
  
  const getFormResponse = () => {
    return new Promise(async (resolve, reject) => {
      let formResponse = await forms.getFormData(
        JSON.parse(apiConfig.CONFIGURATIONS.SEARCH_SSU)
      );
      if (formResponse.responseCode == "OK") {
        resolve(formResponse.result.form.data.fields);
      }
    });
  };

module.exports = { downloadReport, getSsuFilter }