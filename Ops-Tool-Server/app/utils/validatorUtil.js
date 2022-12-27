var spawn = require('child_process').spawn;

/**
 * Module dependencies.
 */
const path = require('path');
const _ = require('lodash');
const appRoot = require('app-root-path');
const fs = require('fs');
const logger = require("../utils/loggerUtil");
var strFilePath = `${appRoot}/uploads/input/`;
var strAssetFilePath = `${appRoot}/uploads/input/`;
var moment = require('moment');
var formats = ["PDF", "HTML", "EPUB", "Video (mp4 and webM)", "Video (mp4 and webM)", "H5P"];
var youtubeFormats = ["YouTube", "Youtube", "URL (YouTube and others)"];


let ValidateDriveUrl = async function (req) {
  return new Promise(function (resolve, reject) {
    if (_.some(formats, _.method('includes', req.strFileType))) {
      if (_.includes(req.strFileName, "https://drive.google.com/open?id=")) {
        resolve({ contentType: "Google drive content", status: true });
      } else if (_.includes(req.strFileName, "https://drive.google.com/file/d/")) {
        resolve({ contentType: "Google drive content", status: true });
      } else {
        reject("File format and file link does not match");
      }
    } else if (_.some(youtubeFormats, _.method('includes', req.strFileType))) {
      if (_.includes(req.strFileName, "www.youtube.com/watch?v=")) {
        resolve({ contentType: "Youtube content", status: true });
      } else if (_.includes(req.strFileName, "https://www.youtube.com/watch?time_continue=")) {
        resolve({ contentType: "Youtube content", status: true });
      } else if (_.includes(req.strFileName, "youtu.be/")) {
        resolve({ contentType: "Youtube content", status: true });
      } else {
        reject("File format and the file link does not match.");
      }
    }else if(req.strFileType == 'Dropbox'){
      resolve({contentType: "Dropbox content", status: true});
    } else {
      reject("File format and file either does not match or not available");
    }
  });
}

/**
 * @param  {} oInput
 */
let checkForIconFormat = function (oInput, data) {
  return new Promise(async function (resolve, reject) {
    let _validFileExtensions = [".jpg", ".jpeg", ".JPG", ".JPEG", ".png"],
      sFileName = oInput,
      blnValid = false;
    for (var j = 0; j < _validFileExtensions.length; j++) {
      var sCurExtension = _validFileExtensions[j];
      if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
        blnValid = true;
        logger.generateLogger("info", "{{RESPONSE}}", "ICON FILE HAS A VALID FORMAT ::: " + strFilePath + oInput, "ICON SIZE AND FORMAT VALIDATION", data);
        var stats = fs.statSync(strFilePath + oInput)
        var fileSizeInBytes = stats["size"];
        if (fileSizeInBytes < 1000000) {
          logger.generateLogger("info", "{{RESPONSE}}", "ICON FILE HAS VALID FILE SIZE ----" + fileSizeInBytes, "ICON SIZE AND FORMAT VALIDATION", data);
          resolve("valid file size");
        } else {
          logger.generateLogger("error", "{{ERROR}}", "ICON FILE SIZE IS GREATER THAN 1MB ----" + fileSizeInBytes, "ICON SIZE AND FORMAT VALIDATION", data);
          reject("Icon size is greater than 1MB");
        }
        break;
      }
    }

    if (!blnValid) {
      oInput.value = "";
      logger.generateLogger("error", "{{ERROR}}", "ICON FORMAT ERROR ::: Icon should be of format .jpg, .png only", "ICON SIZE AND FORMAT VALIDATION", data);
      reject("Icon should be of format .jpg, .png only");
    }
    return true;
  })
}

/**
 * @param  {} file
 */
let checkContentFileSize = async function (file, data) {
  return new Promise(async function (resolve, reject) {
    var stats = fs.statSync(strAssetFilePath + file)
    var fileSizeInBytes = stats["size"];
    if (fileSizeInBytes < 50000000) {
      logger.generateLogger("info", "{{RESPONSE}}", "FILE SIZE IS LESS THAN 50MB AND VALID ----" + fileSizeInBytes, "FILE SIZE VALIDATION", data);
      resolve(true);
    } else {
      logger.generateLogger("error", "{{ERROR}}", "FILE SIZE IS GREATER THAN 50MB ----" + fileSizeInBytes, "FILE SIZE VALIDATION", data);
      reject("File size is greater than 50MB");
    }
  });
}

/**
 * @param  {} filename
 * @param  {} cb
 */
let getFilesizeInBytes = async function (filename) {
  return new Promise(async function (resolve, reject) {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size
    resolve(fileSizeInBytes);
  });
}

/**
 * @param  {} strGDfile
 */
let formatFileAsset = function (strGDfile) {
  return new Promise(async function (resolve, reject) {
    const inputFilePath = `${appRoot}/uploads/input/`;
    const OutputFilePath = `${appRoot}/uploads/streamedOutput/`;

    var args = [
      '-i', inputFilePath + strGDfile.strFileName,
      '-c', 'copy',
      '-movflags', '+faststart',
      inputFilePath + strGDfile.strFileName
    ];

    var proc = spawn('ffmpeg', args);

    proc.stdout.on('data', function (data) { });

    proc.stderr.on('data', function (data) { });

    proc.on('close', function () {

    });
    resolve(true);
  });
}

let formatFileAsset1 = function (strGDfile) {
  return new Promise(async function (resolve, reject) {
    const inputFilePath = `${appRoot}/uploads/input/`;
    const OutputFilePath = `${appRoot}/uploads/input/`;

    fs.copyFile(inputFilePath + strGDfile.strFileName, OutputFilePath + strGDfile.strFileName, (err) => {
      if (err) throw err;
      resolve(true);
    });
  });
}

function getMomentDateTime() {
  var newDate = moment(new Date(), "YYYY-MM-DD HH:mm:ss").utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
  return newDate;
}

function formatMomentDateTime(date) {
  var newDate = date.utcOffset("+05:30").format('MMMM Do YYYY, hh:mm:ss A');
  return newDate;
}


/**
 * @param  {} value
 * @param  {} label
 * @param  {} isCamelCase=false
 */
let filterFileds = function (value, label, isCamelCase = false) {
  var tmp = '';
  if (_.isEmpty(value) || _.isUndefined(value)) {
    logger.error(label + ' filed is empty');
    throw new Error(label + ' filed is empty');
  } else {
    tmp = _.trim(value);
  }

  if (isCamelCase) {
    return _.upperFirst(_.lowerCase(tmp));
  } else {
    return tmp;
  }
}

function getIdFromUrl(url) {
  return new Promise(async function (resolve, reject) {
  if (_.includes(url, "https://drive.google.com/open?id=")) {
    url = url.match(/[-\w]{25,}/);
    if (url && url[0]) {
      resolve(url[0]);
    } else {
      reject(null);
    }
  } else if (_.includes(url, "https://drive.google.com/file/d/")) {

    url = url.match(/\/d\/(.+)\//);
    if (url == null || url.length < 2) {
      resolve(url);
    } else {
      resolve(url[1]);
    }
  } else {
    reject("Url not matched with the google drive link");
  }
});
}

const ltrim = (str) => {
  if (!str) return str;
  return str.replace(/^\s+/g, '');
}

let generateDefaultRequest = (configObj, contentObj, formFieldValues, isYoutube) => {
  let creatorName = JSON.parse(configObj.creatorInfo);
  let contentReq = {
    mimeType: contentObj.strMimeType,
    channel: configObj.strChannel,
    code: configObj.strChannel,
    resourceType: "Learn",
    createdBy: configObj.strUserId,
    createdFor: [configObj.strOrgId],
    framework: configObj.strFramework,
    creator: creatorName.name,
    organisation: configObj.orgName ? [configObj.orgName] : [],
    ownershipType: ["createdFor"],
    mediaType: "content"
  };

  if(!(formFieldValues.includes("contentType"))){
    if (typeof contentObj.contentType != "undefined") { contentReq['contentType'] = contentObj.contentType; } else { contentReq['contentType'] = "Resource"; };
  }

  if (isYoutube) {
    contentReq['artifactUrl'] = "https://www.youtube.com/embed/" + contentObj.strExtContentId + "?autoplay=1&enablejsapi=1",
      contentReq['owner'] = configObj.orgName
  }

  for (var i = 0; i < formFieldValues.length; i++) {
    switch (formFieldValues[i]) {
      case "name":
        if (typeof contentObj.strContentName != "undefined") { contentReq['name'] = contentObj.strContentName; } else { contentReq['name'] = ""; }; break;

      case "description":
        if (typeof contentObj.strContentDesc != "undefined") { contentReq['description'] = contentObj.strContentDesc; } else { contentReq['description'] = ""; }; break;

      case "keywords":
        if (typeof contentObj.strKeywords != "undefined") { contentReq['keywords'] = contentObj.strKeywords; } else { contentReq['keywords'] = ""; }; break;

      case "board":
        if (typeof contentObj.strBoard != "undefined") { contentReq['board'] = contentObj.strBoard; } else { contentReq['board'] = ""; }; break;

      case "medium":
        if (typeof contentObj.strLanguage != "undefined") { contentReq['medium'] = contentObj.strLanguage } else { contentReq['medium'] = []; }; break;

      case "gradeLevel":
        if (typeof contentObj.strGrade != "undefined") { contentReq['gradeLevel'] = contentObj.strGrade } else { contentReq['gradeLevel'] = []; }; break;
  
      case "subject":
        if (typeof contentObj.strSubject != "undefined") { contentReq['subject'] = contentObj.strSubject; } else { contentReq['subject'] = []; }; break;

      case "topic":
        if (typeof contentObj.topic != "undefined") { contentReq['topic'] = contentObj.topic; } else { contentReq['topic'] = []; }; break;

      case "audience":
        if (typeof contentObj.strAudience != "undefined") { contentReq['audience'] = [contentObj.strAudience]; } else { contentReq['audience'] = []; }; break;

      case "author":
        if (typeof contentObj.author != "undefined") { contentReq['author'] = contentObj.author; } else { contentReq['author'] = ""; }; break;

      case "attributions":
        if (!_.isEmpty(contentObj.strAttributions)) { contentReq['attributions'] = contentObj.strAttributions; }; break;

      case "copyright":
        if (typeof contentObj.copyright != "undefined") { contentReq['copyright'] = contentObj.copyright; } else { contentReq['copyright'] = ""; }; break;

      case "copyrightYear":
        if (typeof contentObj.copyrightYear != "undefined") { contentReq['copyrightYear'] = contentObj.copyrightYear; } else { contentReq['copyrightYear'] = ""; }; break;

      case "license":
        if (typeof contentObj.license != "undefined") { contentReq['license'] = contentObj.license; } else { contentReq['license'] = ""; }; break;

      case "primaryCategory":
        if (typeof contentObj.primaryCategory != "undefined") { contentReq['primaryCategory'] = contentObj.primaryCategory; } else { contentReq['primaryCategory'] = ""; }; break;

      case "additionalCategories":
        if (typeof contentObj.additionalCategories != "undefined") { contentReq['additionalCategories'] = contentObj.additionalCategories; } else { contentReq['additionalCategories'] = []; }; break;
    }
  }

  return contentReq;
}

let validateFormFields = async (content, fields, primaryCategoryValues) => {
  return new Promise(async function (resolve, reject) {
    var count = 0, errors = [];
    _.forEach(fields, function (el, index, arr) {
      index['fileFormat'] = "";
      index['filePath'] = "";
      switch (el.name) {
        case "App Icon":
          if (el['required'] == true) { if (typeof content['Icon'] !== "undefined") { } else { errors.push("Icon path not found"); count++; } } else { }; break;

        case "Title":
          if (el['required'] == true) { if (typeof content['Name of the Content'] !== "undefined") { } else { errors.push("Content name is empty"); count++; } } else { }; break;

        case "Description":
          if (el['required'] == true) { if (typeof content['Description of the content in one line - telling about the content'] !== "undefined") { } else { errors.push("Content description is empty"); count++; } } else { }; break;

        case "Keywords":
          if (el['required'] == true) { if (typeof content['Additional Tags / Keywords'] !== "undefined") { } else { errors.push("Keywords are empty"); count++; } } else { }; break;

        case "Board/Syllabus":
          if (el['required'] == true) { if (typeof content['Board'] !== "undefined") { } else { errors.push("Board is empty"); count++; } } else { }; break;

        case "medium":
          if (el['required'] == true) { if (typeof content['Medium'] !== "undefined") { } else { errors.push("Medium is empty"); count++; } } else { }; break;

        case "Class":
          if (el['required'] == true) { if (typeof content['Class'] !== "undefined") { } else { errors.push("Class is empty"); count++; } } else { }; break;

        case "Subject":
          if (el['required'] == true) { if (typeof content['Subject'] !== "undefined") { } else { errors.push("Subject is empty"); count++; } } else { }; break;

        case "Topic":
          if (el['required'] == true) { if (typeof content['Topic'] !== "undefined") { } else { errors.push("Topic is empty"); count++; } } else { }; break;

        case "contentType":
          if (el['required'] == true) { if (typeof content['Content Type'] !== "undefined") { } else { } } else { }; break;

        case "resourceType":
          if (el['required'] == true) { if (typeof content['Resource Type'] !== "undefined") { } else { errors.push("Resource Type is empty"); count++; } } else { }; break;

        case "Audience":
          if (el['required'] == true) { if (typeof content['Audience'] !== "undefined") { if(_.includes(el.range, content['Audience'])) { } else { errors.push("Audience value should be from this list "+JSON.stringify(el.range)); count++; } } else { errors.push("Audience is empty"); count++; } } else { }; break;

        case "Author":
          if (el['required'] == true) { if (typeof content['Author'] !== "undefined") { } else { errors.push("Author field is empty"); count++; } } else { }; break;

        case "attribution":
          if (el['required'] == true) {
            if (typeof content['Attribution (Credits)'] !== "undefined") { } else {
              errors.push("Attributions are empty"); count++;
            }
          } else { }; break;

        case "Copyright":
          if (el['required'] == true) {
            if (typeof content['Copyright'] !== "undefined") { } else {
              errors.push("Copyright field is empty"); count++;
            }
          } else { }; break;

        case "Year of creation": if (el['required'] == true) {
          if (typeof content['Year of creation'] !== "undefined") { } else {
            errors.push("Year of creation field is empty"); count++;
          }
        } else { }; break;

        case "license":
            if (el['required'] == true) { if (typeof content['License'] !== "undefined") { } else { } } else { }; break;

        case 'licenseterms':
            if (el['required'] == true) { if (typeof content['License Terms'] !== "undefined") { } else { } } else { }; break;

        case "fileFormat":
          if (el['required'] == true) { if (typeof content['File Format'] !== "undefined") { } else { errors.push("File format is empty"); count++; } } else { }; break;

        case "filePath":
          if (el['required'] == true) { if (typeof content['File Path'] !== "undefined") { } else { errors.push("File Path is empty"); count++; } } else { }; break;
      
        case "Content Type":
          if (el['required'] == true) { if (typeof content['Primary Category'] !== "undefined") { if(_.includes(primaryCategoryValues, content['Primary Category'])) { } else { errors.push("Primary Category value should be one of "+JSON.stringify(primaryCategoryValues)); count++; } } else { errors.push("Primary Category is empty"); count++; } } else { }; break;

        case "Additional Category":
          if (el['required'] == true) { if (typeof content['Additional Categories'] !== "undefined") { if(_.includes(el.range, content['Additional Categories'])) { } else { errors.push("Additional Categories value should be from this list "+JSON.stringify(el.range)); count++; } } else { errors.push("Additional Categories is empty"); count++; } } else { }; break;
      }
    });
    if (count > 0) {
      reject(errors.toString());
    }
    resolve(true);
  });
};

let ltrimElement = (element) => {
  if (typeof element!=="undefined" && element !== null && element !== "" && element !== "NA") {
    let str = element.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    str = str.replace(/'/g, "\\'");
    let elem = str.split(","), ar = [];
    elem.forEach(el => {
      if(!(/^ *$/.test(el))){
        let tmp = ltrim(el);
        ar.push(tmp.trim());
      }
    });
    return ar;
  } else {
    return [];
  }
}

let removeFileFromPath = () => {
  const OutputFilePath = `${appRoot}/uploads/streamedOutput/`;
  fs.readdir(OutputFilePath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(OutputFilePath, file), err => {
        if (err) throw err;
      });
    }
  });
}

module.exports = {
  checkForIconFormat,
  checkContentFileSize,
  getFilesizeInBytes,
  formatFileAsset,
  formatFileAsset1,
  getMomentDateTime,
  filterFileds,
  getIdFromUrl,
  generateDefaultRequest,
  validateFormFields,
  ltrimElement,
  removeFileFromPath,
  ValidateDriveUrl,
  formatMomentDateTime
};