const express = require('express');
const router = express.Router();
var apiConfig = require('../../config/api.config.json');
/*
Module:multer
multer is middleware used to handle multipart form data
*/
let upload = require('../../config/multer.config');
const { authKeyCloak, authRefresh } = require("../middleware/keycloakAuth");

const usersController = require('../v1/controllers/users/users.controller');
const bulkController = require("../v1/controllers/users/bulkupload.controller");


/*
**USERS CONTROLLER ROUTING
*/
router.route('/update').post(authKeyCloak, usersController.updateUserDetails);
// router.route('/bulkUpload').post(upload.single('user'), usersController.bulkUserUpload);
router.route('/details').post(authKeyCloak, authRefresh, usersController.getUserDetails);
router.route("/data/status").post(authKeyCloak, bulkController.getBulkUploadStatus);
router.route("/search").post(usersController.searchUsersList);
router.route("/upload").post(upload.single('user'), authKeyCloak, bulkController.readUploadCSVdata);
router.route("/status/list").post(usersController.userProcessList);
router.route('/assign').post(authKeyCloak, authRefresh, usersController.userRoleAssign);
router.route("/read").post(authKeyCloak, usersController.getUserDetails);
router.route("/block").post(usersController.blockUser);
router.route("/unblock").post(usersController.unBlockUser);
router.route("/create").post(usersController.createIndividualUser);
router.route("/list/search/filter").get(usersController.getFilterData);
router.route("/create/search/filter").get(usersController.getFilterData);
router.route("/upload/search/filter").get(usersController.getFilterData);
router.route("/upload_status/search/filter").get(usersController.getFilterData);
router.route("/batch_upload_list/search/filter").get(usersController.getFilterData);


module.exports = router;
