const express = require('express');
const router = express.Router();

const formsController = require('../v1/controllers/forms/index.controller');

router.route('/read').post(formsController.formRead);
router.route('/list').post(formsController.formList);
router.route('/update').post(formsController.formUpdate);
router.route("/subrole/search/filter").get(formsController.getFilterData);
router.route("/list/search/filter").get(formsController.getFilterData);

module.exports = router;