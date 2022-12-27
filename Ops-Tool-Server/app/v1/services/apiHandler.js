var request = require("request");
var fs = require('fs-extra');
var logger = require('../../utils/loggerUtil');
var common = require('../../routes/common');
var _CONFIG = common.config();
var apiConfig = require('../../../config/api.config.json');
const { performance } = require('perf_hooks');
const validatorUtil = require("../../utils/validatorUtil");
const appRoot = require('app-root-path')
var strFilePath = `${appRoot}/uploads/input/`;
var strAssetFilePath = `${appRoot}/uploads/streamedOutput/`;
var _ = require("lodash");
var spawn = require('child_process').spawn;

let updateContentThumbnail = async function (strS3AssetPath, strContentId, strChannel, configObj, data) {
    return new Promise(async function (resolve, reject) {
        var strApiUrl = _CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V2 + apiConfig.APIS.UPDATE + "/" + strContentId;
        var getContentPromise = getContent(strContentId, configObj, data);
        getContentPromise.then(function (getcontentdata) {
            logger.generateLogger("info", "{{RESPONSE}}", "GET CONTENT - RESPONSE ::::: ==============>" + JSON.stringify(getcontentdata), "updateContentThumbnail", data);
            var strContentGettatus = getcontentdata['params']['status']
            if (_.isEqual(_.lowerCase(strContentGettatus), 'successful')) {
                var strVersionKey = getcontentdata['result']['content']['versionKey'];
                var strApiBody = {
                    "request": {
                        "content": {
                            "versionKey": strVersionKey,
                            "appIcon": strS3AssetPath
                        }
                    }
                };

                var patchPromise = patch(strApiUrl, strApiBody, strChannel, configObj, data);
                patchPromise.then(async function (patchdata) {
                    logger.generateLogger("info", "{{RESPONSE}}", "PATCH PROMISE - RESPONSE ::::: ==============>" + JSON.stringify(patchdata), "updateContentThumbnail", data);
                    resolve(patchdata);
                }, async function (error) {
                    logger.generateLogger("error", "{{ERROR}}", "PATCH PROMISE - ERROR ::::: ==============>" + JSON.stringify(error), "updateContentThumbnail", data);
                    reject(error);
                });
            }
        }, async function (error) {
            logger.generateLogger("error", "{{ERROR}}", "GET CONTENT PROMISE - ERROR ::::: ==============>" + JSON.stringify(error), "updateContentThumbnail", data);
            reject(error);
        });
    });
}

let getContent = function (strContentId, configObj, data) {
    var strApiUrl = _CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V2 + apiConfig.APIS.READ + "/" + strContentId;
    var strResponse = null;

    var options = {
        method: 'GET',
        url: strApiUrl,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': _CONFIG.API_KEY,
            'x-authenticated-user-token': configObj.userToken,
        },
        body: {},
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}}", "GET CONTENT - API CALL REQUEST ::::: ==============>" + JSON.stringify(options), "getContent", data);
    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "GET CONTENT - API CALL ERROR ::::: ==============>" + JSON.stringify(error), "getContent", data);
                reject(error);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "GET CONTENT - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "getContent", data);
                resolve(body);
            } else {
                let err = new Error('getContent function Error1');
                logger.generateLogger("error", "{{error}}", "GET CONTENT - API CALL ERROR ::::: ==============>" + JSON.stringify(body) + ":::" + JSON.stringify(err), "getContent", data);
                reject(err);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'This content > GET CONTENT API function : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'getContent', data);
        });
    });
}


let patch = function (strApiUrl, strApiBody, strChannel, configObj, data) {
    var options = {
        method: 'PATCH',
        url: strApiUrl,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': _CONFIG.API_KEY,
            'x-authenticated-user-token': configObj.userToken,
            'X-Channel-id': configObj.strChannel
        },
        body: strApiBody,
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}}", "PATCH - API CALL REQUEST ::::: ==============>" + JSON.stringify(options), "patch", data);
    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "PATCH - API CALL ERROR ::::: ==============>" + JSON.stringify(error), "patch", data);
                reject(error);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "PATCH - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "patch", data);
                resolve(body);
            } else {
                let err = new Error('::: PATCH API ERROR :: UPDATE API TIMEOUT');
                logger.generateLogger("error", "{{error}}", "PATCH - API CALL ERROR ::::: ==============>" + JSON.stringify(body) + ":::" + JSON.stringify(err), "patch", data);
                reject(err);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'This content > PATCH API function : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'patch', data);
        });
    });

}

let transceive = function (strApiUrl, strApiBody, configObj, data) {
    var options = {
        method: 'POST',
        url: strApiUrl,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': _CONFIG.API_KEY,
            'x-authenticated-user-token': configObj.userToken,
            'X-Channel-Id': configObj.strChannel,
        },
        body: strApiBody,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}}", "TRANSCEIVE - API CALL REQUEST ::::: ==============>API === " + options.url + " === API BODY ===" + JSON.stringify(options.body), "transceive", data);
    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + error.params.errmsg, "transceive", data);
                reject(error.params.errmsg);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "TRANSCEIVE - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "transceive", data);
                resolve(body);
            } else if (body && body.responseCode == 'CLIENT_ERROR') {
                if (body.result.messages) {
                    let temp = [];
                    body.result.messages.forEach(element => {
                        if (_.includes(element, 'Metadata board should belong from')) {
                            temp.push(" Metadata Board does not belong to the framework");
                        } else if (_.includes(element, 'Metadata medium should belong from')) {
                            temp.push(" Metadata Medium does not belong to the framework")
                        } else if (_.includes(element, 'Metadata gradeLevel should belong from')) {
                            temp.push(" Metadata Grade does not belong to the framework")
                        } else if (_.includes(element, 'Metadata subject should belong from')) {
                            temp.push(" Metadata Subject does not belong to the framework");
                        } else if (_.includes(element, 'Metadata topic should belong from')) {
                            temp.push(" Metadata Topic does not belong to the framework");
                        } else if (_.includes(element, 'Metadata mimeType should be one of')) {
                            temp.push(" Metadata MimeType Mismatch with the content file format");
                        } else if (_.includes(element, 'Metadata contentType should be one of')) {
                            temp.push(" Metadata contentType does not match the existing set of content types");
                        } else {
                            temp.push(element);
                        }
                    });
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg + ":::" + temp.toString(), "transceive", data);
                    reject(body.params.errmsg + ":::" + temp.toString());
                } else {
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg, "transceive", data);
                    reject(body.params.errmsg);
                }
            } else {
                logger.generateLogger("error", "{{error}}", "TRANSCEIVE - API CALL ERROR ::::: API TIMEOUT ERROR ====>" + strApiUrl, "transceive", data);
                reject("API TIMEOUT ERROR ====>" + strApiUrl);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'This content > trasceive : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'transceive', data);
        });
    });
}


let getPreSignedURL = async function (strContentId, strFileName, configObj, data) {
    var strApiUrl = _CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V2 + apiConfig.APIS.UPLOAD + "/" + apiConfig.SUB_URL.URL + strContentId;
    var strApiBody = { "request": { "content": { "fileName": strFileName } } };

    logger.generateLogger("info", "{{DATA}}", "In Content --> getPreSignedURL:: strApiUrl:: " + strApiUrl, "getPreSignedURL", data);
    logger.generateLogger("info", "{{DATA}}", "In Content --> getPreSignedURL:: strApiBody:: " + JSON.stringify(strApiBody), "getPreSignedURL", data);
    return new Promise(async function (resolve, reject) {
        var transceivePromise = transceive(strApiUrl, strApiBody, configObj, data);
        transceivePromise.then(async function (data) {
            var strPreSignedUrl = "";
            strPreSignedUrl = data['result']['pre_signed_url'];
            logger.generateLogger("info", "{{RESPONSE}}", "In Content --> getPreSignedURL --> strResponse:: " + JSON.stringify(data), "getPreSignedURL", data);
            resolve(strPreSignedUrl);
        }, async function (error) {
            logger.generateLogger("error", "{{ERROR}}", "In Content --> getPreSignedURL --> STRERROR:: " + JSON.stringify(error), "getPreSignedURL", data);
            reject(error);
        });

    });
}

let migrateBroadcastContents = async function (presignedUrl, file, data) {
    logger.generateLogger("info", "{{DATA}}", "In Content --> migrateBroadcastContents::", "migrateBroadcastContents", data);
    logger.generateLogger("info", "{{DATA}}", "In Content --> migrateBroadcastContents:::: " + presignedUrl + " ====> " + file, "getPreSignedURL", data);
    return new Promise(async function (resolve, reject) {
        var args = [
            'cp', file + process.env.BROADCASTCONTENTSAS,
            presignedUrl
        ];

        var proc = spawn('azcopy', args);

        proc.stdout.on('data', function (data) {
            console.log(data);
        });

        proc.stderr.on('data', function (data) {
            console.log(data);
            reject(data);
        });

        proc.on('close', function () {
            console.log("closed");
            resolve();
        });
    });
}

let uploadFileToS3SinglePUT = async function (presignurl, contentFile, strMimeType, data) {
    var stats = fs.statSync(contentFile);
    let options = {
        method: 'PUT',
        url: presignurl,
        headers: {
            'Content-Type': strMimeType,
            "x-ms-blob-type": "BlockBlob",
            'Content-Length': stats['size']
        }
    }
    logger.generateLogger("info", "{{DATA}}", "UPLOADING FILE TO AZURE:::" + JSON.stringify(options), "uploadFileToS3SinglePUT", data);
    return new Promise(async function (resolve, reject) {
        fs.createReadStream(contentFile).pipe(
            request({
                method: 'PUT',
                url: presignurl,
                headers: {
                    'Content-Type': strMimeType,
                    "x-ms-blob-type": "BlockBlob",
                    'Content-Length': stats['size']
                }
            }, async function (err, res, body) {
                if (res && res.statusCode && res.statusCode === 201) {
                    logger.generateLogger("info", "{{RESPONSE}}", "UPLOADED FILE TO AZURE BLOB STORAGE RESPONSE:::" + JSON.stringify(res), "uploadFileToS3SinglePUT", data);
                    resolve(res.statusCode);
                } else {
                    logger.generateLogger("error", "{{ERROR}}", "ERROR IN UPLOADING FILE TO AZURE BLOB STORAGE:::" + JSON.stringify(err), "uploadFileToS3SinglePUT", data);
                    reject(err);
                }
            })
        );
    });
}

let uploadToContent = function (strAssetBaseURL, strContentId, configObj, data) {
    // var strApiUrl = _CONFIG.BASE + _CONFIG.SUB_URL.API + _CONFIG.SUB_URL.CONTENT + _CONFIG.SUB_URL.V1 + _CONFIG.APIS.UPLOAD + "/" + strContentId + "?fileUrl=" + strAssetBaseURL;
    // var strApiBody = {};
    // logger.generateLogger("info", "{{DATA}}", "UPLOADING TO CONTENT:::" + strApiUrl, "uploadToContent", data);
    // return new Promise(async function (resolve, reject) {
    //     var transceivePromise = transceive(strApiUrl, strApiBody, configObj, data);
    //     transceivePromise.then(async function (transceivedata) {
    //         logger.generateLogger("info", "{{RESPONSE}}", "UPLOAD TO CONTENT STRING RESPONSE:::::" + JSON.stringify(transceivedata), "uploadToContent", data);
    //         resolve(transceivedata);
    //     }, async function (error) {
    //         logger.generateLogger("error", "{{ERROR}}", "ERROR IN UPLOAD TO CONTENT:::::" + error, "uploadToContent", data);
    //         reject(error);
    //     });
    // });
    var options = {
        method: 'POST',
        // url: _CONFIG.BASE + apiConfig.SUB_URL.ACTION + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V3 + apiConfig.APIS.UPLOAD + "/" + strContentId,
        url: _CONFIG.BASE + apiConfig.SUB_URL.API + 'private/' + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V3 + apiConfig.APIS.UPLOAD + "/" + strContentId,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': _CONFIG.API_KEY,
            'x-authenticated-user-token': configObj.userToken,
            'X-Channel-Id': configObj.strChannel,
        },
        formData: {
            'fileUrl': strAssetBaseURL
        },
        json: true
    }
    logger.generateLogger("info", "{{REQUEST}}", "TRANSCEIVE - API CALL REQUEST ::::: ==============>API === " + options.url + " === API BODY ===" + JSON.stringify(options), "transceive", data);
    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + error.params.errmsg, "transceive", data);
                reject(error.params.errmsg);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "TRANSCEIVE - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "transceive", data);
                resolve(body);
            } else if (body && body.responseCode == 'CLIENT_ERROR') {
                if (body.result.messages) {
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg + ":::" + body.result.messages.toString(), "transceive", data);
                    if (body.result.messages[0].indexOf("Metadata topic") > -1) {
                        reject(body.params.errmsg + "::: Metadata topic does not belong to the framework. Topic mismatch");
                    } else {
                        reject(body.params.errmsg + ":::" + body.result.messages.toString());
                    }
                } else {
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg, "transceive", data);
                    reject(body.params.errmsg);
                }
            } else {
                //logger.generateLogger("error", "{{error}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + JSON.stringify(body.result), "transceive", data);
                //reject(body.result.messages);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'This content > trasceive : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'transceive', data);
        });
    });
}

let createThumbImage = function (contentObj, configObj, data) {
    let strIcon = contentObj.strIcon;
    let strContentId = contentObj.strContentId;
    let strImageLocalPath = strFilePath;
    let strChannel = configObj.strChannel;

    if (strIcon != null && !_.isEmpty(strIcon)) {
        var iExt = strIcon.lastIndexOf(".");
        var strImageType = strIcon.substring(iExt + 1);
        if (_.isEqual(_.lowerCase(strImageType), "jpg")) {
            strImageType = "jpeg";
        }
        return new Promise(async function (resolve, reject) {
            uploadImage(strContentId, strImageLocalPath, strIcon, strImageType, strChannel, configObj, data)
                .then(async function (res) {
                    logger.generateLogger("info", "{{RESPONSE}}", "UPLOAD IMAGE RESPONSE:::::" + JSON.stringify(res), "uploadImage", data);
                    resolve(res);
                }).catch(async function handleError(uploadImageEr) {
                    logger.generateLogger("error", "{{ERROR}}", "ERROR IN UPLOAD IMAGE:::::" + uploadImageEr, "uploadImage", data);
                    reject(uploadImageEr);
                });
        });
    }
}

let uploadImage = async function (strContentId, strImagePath, strImageName, strImageType, strChannel, configObj, data) {
    logger.generateLogger("info", "{{DATA}}", "UPLOADING THUMBNAIL IMAGE", "uploadImage", data);
    return new Promise(async function (resolve, reject) {
        getPreSignedURL(strContentId, strImageName, configObj, data)
            .then(async function (response) {
                var strPreSignedUrlImage = response;
                logger.generateLogger("info", "{{RESPONSE}}", "PRESIGNED URL IMAGE:::::" + strPreSignedUrlImage, "getPreSignedURL", data);
                var index2 = strPreSignedUrlImage.indexOf("?");
                var strAssetBaseUrlImage = strPreSignedUrlImage.substring(0, index2);
                logger.generateLogger("info", "{{DATA}}", "STRING BASE ASSET URL IMAGE:::::" + strAssetBaseUrlImage, "getPreSignedURL", data);
                var urlImage = strPreSignedUrlImage;
                var imageFile = strImagePath + strImageName;
                logger.generateLogger("info", "{{DATA}}", "MASTER FILE UPLOAD IMAGE:::::" + imageFile, "getPreSignedURL", data);
                uploadFileToS3SinglePUT(urlImage, imageFile, strImageType, data)
                    .then(async function (res) {
                        logger.generateLogger("info", "{{RESPONSE}}", "UPLOADED IMAGE TO AZURE BLOB:::::" + JSON.stringify(res), "uploadFileToS3SinglePUT", data);
                        updateContentThumbnail(strAssetBaseUrlImage, strContentId, strChannel, configObj, data)
                            .then(async function (resp) {
                                logger.generateLogger("info", "{{RESPONSE}}", "UPDATED CONTENT THUMBNAIL:::::" + JSON.stringify(resp), "updateContentThumbnail", data);
                                resolve(resp);
                            }).catch(async function handleError(updateContentEr) {
                                logger.generateLogger("info", "{{RESPONSE}}", "ERROR IN UPDATING CONTENT THUMBNAIL:::::" + JSON.stringify(updateContentEr), "updateContentThumbnail", data);
                                reject(updateContentEr);
                            });
                    }).catch(async function handleError(uploadFileEr) {
                        logger.generateLogger("info", "{{ERROR}}", "ERROR IN UPLOADING IMAGE TO AZURE BLOB:::::" + JSON.stringify(uploadFileEr), "uploadFileToS3SinglePUT", data);
                        reject(uploadFileEr);
                    });
            }).catch(async function handleError(presignedURLEr) {
                logger.generateLogger("error", "{{ERROR}}", "PRESIGNED URL ERROR:::::" + presignedURLEr, "getPreSignedURL", data);
                reject(presignedURLEr);
            });
    });
}

let createDefaultContent = async function (contentObj, configObj, formFieldValues, data) {

    let contentReq = await validatorUtil.generateDefaultRequest(configObj, contentObj, formFieldValues, false);
    var strApiBody = {
        request: {
            content: contentReq
        }
    };

    logger.generateLogger("info", "{{DATA}}", "In Content --> createDefaultContent:: strApiBody:: " + strApiBody, "createDefaultContent", data);
    return new Promise(async function (resolve, reject) {
        transceive(_CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.PRIVATE + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V3 + apiConfig.APIS.CREATE, strApiBody, configObj, data)
            .then(async function (TRANSCEIVEdata) {
                logger.generateLogger("info", "{{RESPONSE}}", "In Content --> createDefaultContent --> strResponse:: " + JSON.stringify(data), "createDefaultContent", data);
                if (TRANSCEIVEdata['result']['content_id']) {
                    resolve(TRANSCEIVEdata['result']['content_id']);
                } else if (TRANSCEIVEdata['result']['identifier']) {
                    resolve(TRANSCEIVEdata['result']['identifier']);
                }

            }, async function (error) {
                logger.generateLogger("ERROR", "{{ERROR}}", "In Content --> CREATEDEFAULTCONTENT:: STRERROR:: " + error, "createDefaultContent", data);
                reject(error);
            });
    });
}

let createYoutubeContent = async function (contentObj, configObj, formFieldValues, data) {
    let contentReq = await validatorUtil.generateDefaultRequest(configObj, contentObj, formFieldValues, true);
    var strApiBody = {
        request: {
            content: contentReq
        }
    };

    return new Promise(async function (resolve, reject) {
        transceive(_CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.PRIVATE + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V3 + apiConfig.APIS.CREATE, strApiBody, configObj, data)
            .then(async function (trdata) {
                var content_id = trdata['result']['node_id'];
                resolve(content_id);
            }, async function (error) {
                logger.generateLogger("error", "{{ERROR}}", "ERROR IN CREATING YOUTUBE CONTENT" + JSON.stringify(error), "createYoutubeContent", data);
                reject(error);
            });
    })
}

let createShallowContent = async function (contentObj, configObj, data) {

    let contentOrigin = contentObj.strContentOrigin;
    var strApiBody = {
        request: {
            content: {
                createdBy: configObj.strUserId,
                createdFor: configObj.strChannel,
                organisation: configObj.orgName,
                framework: configObj.strFramework,
                board: contentObj.strBoard.trim(),
                medium: contentObj.strMedium,
                gradeLevel: contentObj.strGrade,
                subject: contentObj.strSubject
            }
        }
    };

    logger.generateLogger("info", "{{DATA}}", "In Content --> createDefaultContent:: strApiBody:: " + strApiBody, "createDefaultContent", data);
    return new Promise(async function (resolve, reject) {
        transceiveShallowCopy(_CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V1 + apiConfig.APIS.COPY + contentOrigin + '?type=shallow', strApiBody, configObj, data)
            .then(async function (TRANSCEIVEdata) {
                logger.generateLogger("info", "{{RESPONSE}}", "In Content --> createDefaultContent --> strResponse:: " + JSON.stringify(data), "createDefaultContent", data);
                if (TRANSCEIVEdata['result']['node_id']) {
                    let copy_content_id = TRANSCEIVEdata['result']['node_id'][contentOrigin];
                    await publishContent(copy_content_id, data)
                        .then(async function (publishResp) {
                            logger.generateLogger("info", "{{RESPONSE}}", "In Content --> createDefaultContent --> strResponse:: " + JSON.stringify(data), "contentPublish", data);
                                if(publishResp.result && publishResp.result.node_id) {
                                    let publishStatus = "published";
                                    resolve ({ copy_content_id, publishStatus });
                                }
                        }, async function (error) {
                            logger.generateLogger("ERROR", "{{ERROR}}", "In Content --> CREATEDEFAULTCONTENT:: STRERROR:: " + error, "contentPublish", data);
                            resolve({copy_content_id, publishStatus: error});
                        })
                } else {

                }

            }, async function (error) {
                logger.generateLogger("ERROR", "{{ERROR}}", "In Content --> CREATEDEFAULTCONTENT:: STRERROR:: " + error, "createDefaultContent", data);
                reject(error);
            });
    });
}

let transceiveShallowCopy = function (strApiUrl, strApiBody, configObj, data) {
    var options = {
        method: 'POST',
        url: strApiUrl,
        headers: {
            "Content-Type": 'application/json',
            Authorization: 
            _CONFIG.API_KEY,
            "x-authenticated-user-token": configObj.userToken,
            "X-Channel-ID": configObj.strChannel,
        },
        body: strApiBody,
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}}", "TRANSCEIVE - API CALL REQUEST ::::: ==============>API === " + options.url + " === API BODY ===" + JSON.stringify(options.body), "transceive", data);
    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + error.params.errmsg, "transceive", data);
                reject(error.params.errmsg);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "TRANSCEIVE - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "transceive", data);
                resolve(body);
            } else if (body && body.responseCode == 'CLIENT_ERROR') {
                if (body.result.messages) {
                    let temp = [];
                    temp.push(body.result.messages)
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg + ":::" + temp.toString(), "transceive", data);
                    reject(body.params.errmsg + ":::" + temp.toString());
                } else {
                    logger.generateLogger("info", "{{ERROR}}", "TRANSCEIVE - API CALL ERROR ::::: ==============>" + body.params.errmsg, "transceive", data);
                    reject(body.params.errmsg);
                }
            } else {
                logger.generateLogger("error", "{{error}}", "TRANSCEIVE - API CALL ERROR ::::: API TIMEOUT ERROR ====>" + strApiUrl, "transceive", data);
                reject("API TIMEOUT ERROR ====>" + strApiUrl);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'This content > trasceive : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'transceive', data);
        });
    });
} 

let publishContent = function (identifier, data) {
    var strApiUrl = _CONFIG.BASE + apiConfig.SUB_URL.API + apiConfig.SUB_URL.PRIVATE + apiConfig.SUB_URL.CONTENT + apiConfig.SUB_URL.V3 + apiConfig.APIS.PUBLISH + identifier;
    var options = {
        method: 'POST',
        url: strApiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': _CONFIG.API_KEY
        },
        body: {
            request: {
              content: {
                publisher: "EkStep",
                      lastPublishedBy: "Ops Tool",
                      publishChecklist:[
                          "Good Content",
                          "Very Good"
                          ],
                    publishComment:"Good Work"
              }
            }
          },
        json: true
    }

    logger.generateLogger("info", "{{REQUEST}}", "PUBLISH - API CALL REQUEST ::::: ==============>API === " + options.url + " === API BODY ===" + JSON.stringify(options.body), "publishContent", data);

    return new Promise(function (resolve, reject) {
        var startTime = performance.now();
        request(options, function (error, response, body) {
            if (error) {
                logger.generateLogger("info", "{{ERROR}}", "PUBLISH - API CALL ERROR ::::: ==============>" + error.params.errmsg, "publishContent", data);
                reject(error.params.errmsg);
            } else if (body && body.responseCode == 'OK') {
                logger.generateLogger("info", "{{RESPONSE}}", "PUBLISH - API CALL RESPONSE ::::: ==============>" + JSON.stringify(body), "publishContent", data);
                resolve(body);
            } else {
                logger.generateLogger("error", "{{ERROR}}", "PUBLISH - API CALL ERROR ::::: API TIMEOUT ERROR ====>" + strApiUrl, "publishContent", data);
                reject("API TIMEOUT ERROR ====>" + strApiUrl);
            }
            var endTime = performance.now();
            logger.generateLogger('info', '{{DATA}}', 'content publish function : Took :: ' + (endTime - startTime).toFixed(4) + ' :: milliseconds', 'transceive', data);
        });
    });
}

module.exports = {
    updateContentThumbnail, getContent, patch, transceive, getPreSignedURL, uploadFileToS3SinglePUT, uploadToContent, createThumbImage, uploadImage, createDefaultContent, createYoutubeContent, migrateBroadcastContents, createShallowContent
};
