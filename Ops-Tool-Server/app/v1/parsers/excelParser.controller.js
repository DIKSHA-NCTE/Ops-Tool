/**
 * Module dependencies.
 */

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
const loggerUtil = require("../../utils/loggerUtil");
var pool = require('../../../config/database');
var strFilePath = `${appRoot}/uploads/input/`;

let writeErrorInExcel = function (excelPath, error) {
    try {
      var wb = XLSX.readFile(excelPath);
      var sheetNames = wb.SheetNames;
      var ws = wb.Sheets[sheetNames[0]];
      var rowIndex = index + 1;
      XLSX.utils.sheet_add_json(ws, [{ P: _.toString(error) }], { skipHeader: true, origin: "P" + rowIndex });
      XLSX.writeFile(wb, excelPath);
    } catch (error) {
      // logger.error('Error in writeErrorInExcel function');
    }
  }
  
  let readExcelFile = function (excelPath, data, res) {
    loggerUtil.generateLogger("info","READ EXCEL FILE FROM THE PATH ::: "+excelPath,"EXCEL PARSER ====> READ EXCEL FILE","readExcelFile",data);
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        var workbook = XLSX.readFile(excelPath);
        var sheet_name_list = workbook.SheetNames;
        var worksheet = workbook.Sheets[sheet_name_list[0]];
        var contentData = XLSX.utils.sheet_to_json(worksheet);
        if (contentData.length > 0) {
          if(contentData.length > 5000){
            loggerUtil.generateLogger("error","Excel Parser Error ::: Batch processing accepts maximum of 5000 content records. Currently the total records in this excel is beyond 5000.","EXCEL PARSER ====> READ EXCEL FILE","readExcelFile",data);
            reject('Batch processing accepts maximum of 5000 content records. Currently the total records in this excel is beyond 5000.');
          }else{
            loggerUtil.generateLogger("info","{{DATA}}","Excel Parsed Successfully","readExcelFile",data);
            resolve(contentData);
          }
        } else {
          loggerUtil.generateLogger("error","Excel ERROR ::: Excel file is empty!!","EXCEL PARSER ====> READ EXCEL FILE","readExcelFile",data);
          reject('Excel file is empty!!');
        }
      }, 100);
    });
  }


module.exports = { readExcelFile, writeErrorInExcel}