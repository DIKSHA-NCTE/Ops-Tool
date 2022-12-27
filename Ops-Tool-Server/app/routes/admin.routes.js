const express = require("express");
const router = express.Router();
// let configurationController = require('../v1/controllers/configurations/index.controller');
const constantController = require("../v1/controllers/admin/constant.controller");
const moduleController = require("../v1/controllers/admin/module.controller");

/*
 **  CONSTANT CONTROLLER ROUTING
 */
router.post("/constants/list", async function (req, res) {
  const reqBody = req.body, reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };

  try {
    let response = await constantController.getAllConstants(reqBody, data);
    if (response.result.length > 0) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json(response);
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json(response);
    }
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.json(error);
  }
});

router.route("/constants/create").post(constantController.addNewConstant);
router.route("/constants/delete/:id").delete(constantController.deleteConstant);

/*
 **  MODULE CONTROLLER ROUTING
 */
router.route("/modules/list").get(moduleController.getAllModules);
router.route("/modules/create").post(moduleController.createModule);
router.route("/modules/update").post(moduleController.updateModule);
router.route("/modules/delete/:id").delete(moduleController.deleteModule);
router.route("/modules/get/:id").get(moduleController.readModule);
// router.route('/module/subModules').post(moduleController.getSubModules);

module.exports = router;
