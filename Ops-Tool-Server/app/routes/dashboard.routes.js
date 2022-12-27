const express = require('express');
const router = express.Router();
let dashboardController = require('../v1/controllers/dashboard/index.controller');

/*
** DASHBOARD CONTROLLER ROUTING
*/

router.route('/list').get(dashboardController.getDashboardData);

module.exports = router;
