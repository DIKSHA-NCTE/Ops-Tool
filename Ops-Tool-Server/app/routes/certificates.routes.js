const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authKeyCloak, authRefresh } = require("../middleware/keycloakAuth");

/*
Module:multer
multer is middleware used to handle multipart form data
*/

let validator = require('../middleware/validators');

const loggRouter = require("../middleware/middleware");

const certController = require("../v1/controllers/certificates/index.controller");
/*
**CONTENTS CONTROLLER ROUTING
*/

router.route('/search').post(certController.searchUserListing);

router.route("/user/enrollment").post(authKeyCloak, authRefresh, certController.enrollmentList);

router.route("/pdf/download").post(authRefresh, certController.downloadPdfCertificate);

router.route("/svg/download").post(authRefresh, certController.downloadSvgCertificate);

router.route("/course/batch/list").post(certController.searchCourseBatch);

router.route("/user/search/filter").get(certController.getFilterData);

router.route("/course/search/filter").get(certController.getFilterData);

module.exports = router;