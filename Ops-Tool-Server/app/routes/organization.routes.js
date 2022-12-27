const express = require("express");
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/

const orgData = require("../v1/controllers/organization/organization.controller");
/*
 **ORG CONTROLLER ROUTING
 */
router.post("/list", async function (req, res) {
  let data = {
    body: req.body,
    headers: req.headers
  };
  if (req.headers.userid === req.session.userId) {
    data["token"] = JSON.parse(req.session["keycloak-token"])["access_token"];
  }
  try {
    let orgResponse = await orgData.getOrgList(data);
    if (orgResponse.statusCode == 200) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        response: orgResponse.response.result.response,
      });
    }
  } catch (er) {
    if (er.statusCode == 500) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 500,
        error: er.error,
        error_description: er.error_description,
      });
    } else if (er.statusCode == 400) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 400,
        error: "Unable to fetch the organization list",
        error_description: "Unable to fetch the organization list",
      });
    }
  }
});

router.route("/read").post(orgData.readOrg);

router.post("/create", async function (req, res) {
  if (req.headers.userid === req.session.userId) {
    req.body["token"] = JSON.parse(req.session["keycloak-token"])["access_token"];
  }
  try {
    let createResponse = await orgData.createOrganization(req);
    if (createResponse.statusCode == 200) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        response: createResponse.response.result
      });
    }
  } catch (er) {
    if (er.statusCode == 500) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 500,
        error: er.error,
        error_description: er.error_description,
      });
    } else if (er.statusCode == 400) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 400,
        error: "Unable to create organization",
        error_description: "Unable to create organization",
      });
    }
  }
});

router.post("/update", async function (req, res) {
  if (req.headers.userid === req.session.userId) {
    req.body["token"] = JSON.parse(req.session["keycloak-token"])["access_token"];
  }
  try {
    let updateResponse = await orgData.updateOrganization(req);
    if (updateResponse.statusCode == 200) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 200,
        response: updateResponse.response.result
      });
    }
  } catch (er) {
    if (er.statusCode == 500) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 500,
        error: er.error,
        error_description: er.error_description,
      });
    } else if (er.statusCode == 400) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: 400,
        error: "Unable to update organization",
        error_description: "Unable to update organization",
      });
    }
  }
});

//ORG SEARCH FILTER ROUTING

router.route("/list/search/filter").get(orgData.getFilterData);
router.route("/create/search/filter").get(orgData.getFilterData);
router.route("/update/search/filter").get(orgData.getFilterData);

module.exports = router;
