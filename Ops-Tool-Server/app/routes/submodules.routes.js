const express = require('express');
const router = express.Router();
let submodulesController = require('../v1/controllers/submodules/index.controller');

/*
** REPORTS CONTROLLER ROUTING
*/

router.route('/list').post(submodulesController.getSubModulesData);

module.exports = router;
