const express = require('express');
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/
let upload = require('../../config/multer.config');
const csvParser = require("../v1/parsers/csvParser");

/*
**CSV PARSER ROUTING
*/
router.route('/parseCsv').post(upload.single('file'), csvParser.readCSVdata);

module.exports = router;
