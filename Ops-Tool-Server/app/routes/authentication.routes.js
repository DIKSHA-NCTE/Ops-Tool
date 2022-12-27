const express = require('express');
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/
const loggRouter = require("../middleware/middleware");
const loginKeyCloakController = require('../v1/controllers/authentication/login.controller');

/*
**AUTHENTICATION CONTROLLER ROUTING
*/

router.route('/token').post(loginKeyCloakController.getKeycloakToken);

module.exports = router;