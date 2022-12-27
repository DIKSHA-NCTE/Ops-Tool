const express = require('express');
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/
let upload = require('../../config/multer.config');
let validator = require('../middleware/validators');
const loggRouter = require("../middleware/middleware");

/*
** USER ROLES MANAGEMNT CONTROLLER ROUTING
*/

router.route('/list').post(loggRouter.fetchExistingSupportUsersList);
router.route('/add').post(loggRouter.createNewSupportUser);
router.route('/delete').post(loggRouter.deleteSupportUser);
router.route('/read').post(loggRouter.fetchSupportUser);
router.route('/update').post(loggRouter.updateSupportUser);

module.exports = router;
