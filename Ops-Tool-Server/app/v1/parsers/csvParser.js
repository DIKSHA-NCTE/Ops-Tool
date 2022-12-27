const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const appRoot = require('app-root-path');
var download = require('download-file');
var XLSX = require("xlsx");
var excelParser = require('./excelParser.controller');
var logger = require("../../../config/winston");

let csvData = [];
const readCSVdata = (req, res) => {
  logger.info(":::CSV FORMATTING REQUEST INIT:::");
  logger.info(":::REQUEST BODY ===>"+JSON.stringify(req.body));
  logger.info(":::REQUEST FILE ===>"+JSON.stringify(req.file));
  
  var configObj = {
    "strChannel": req.body.channel,
    "excelPath": `${appRoot}/` + req.file.path
  }

  var workbook = XLSX.readFile(`${appRoot}/` + req.file.path);
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  for (var i = 0; i < xlData.length; i++) {
    let rowData = xlData[i];
    
    let rolesData = [];
    
    if (rowData['ROLES']) {
      rolesData.push(rowData['ROLES']);
    }

    if (rowData['USER ID']) {
      rolesData.push(rowData['USER ID']);
    }

    if (rowData['SCHOOL EXTERNAL ID']) {
      rolesData.push(rowData['SCHOOL EXTERNAL ID']);
    }

    if (rowData['__EMPTY']) {
      rolesData.push(rowData['__EMPTY']);
    }

    for (var j = 1; j < 15; j++) {
      if (typeof rowData["__EMPTY_" + j] != "undefined") {
        rolesData.push(rowData['__EMPTY_' + j]);
      }
    }

    let roleData = '';
    if (rolesData.length == 1) {
      roleData = rolesData.toString();
    } else {
      roleData = rolesData + "";
    }

    let ObjData = {
      name: rowData['NAME'],
      userType: rowData['USER_TYPE'],
      phone: rowData['MOBILE PHONE'],
      email: rowData['EMAIL'],
      roles: roleData,
      schoolId: req.body.channel,
      userId: '',
      extId: ''
    }

    csvData.push(ObjData);
  }

  logger.info(":::CSV FORMATTING ===> UPLOADED FILE PROCESSED SUCCESSFULLY:::");
  const csvWriter = createCsvWriter({
    path: `${appRoot}/` + 'uploads/csvOutput/' + req.file.filename + '.csv',
    header: [
      { id: 'name', title: 'NAME' },
      { id: 'phone', title: 'MOBILE PHONE' },
      { id: 'email', title: 'EMAIL' },
      { id: 'schoolId', title: 'SCHOOL ID' },
      { id: 'userType', title: 'USER_TYPE' },
      { id: 'roles', title: 'ROLES' },
      { id: 'userId', title: 'USER ID' },
      { id: 'extId', title: 'SCHOOL EXTERNAL ID' }
    ]
  });

  csvWriter
    .writeRecords(csvData)
    .then(() => logger.info(":::CSV FORMATTING ===> FORMATTED FILE WRITTEN SUCCESSFULLY:::"));

  let UploadedFileName = req.file.filename;
  var url = `${appRoot}/` + 'uploads/csvOutput/' + UploadedFileName + '.csv'

  return res.json({
    "status": 200, "error": "", "response": {
      "downloadUrl": '/csvOutput/' + UploadedFileName + '.csv'
    }
  });
}


module.exports = { readCSVdata };
