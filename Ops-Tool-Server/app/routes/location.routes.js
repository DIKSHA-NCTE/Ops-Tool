const express = require('express');
const router = express.Router();

const locationController = require('../v1/controllers/location/location.controller');

router.post("/search", async function (req, res) {
    let data = {
      body: req.body,
      headers: req.headers
    };
    if (req.headers.userid === req.session.userId) {
      data["token"] = JSON.parse(req.session["keycloak-token"])["access_token"];
    }
    try {
      let locationResponse = await locationController.locationSearch(data);
      if (locationResponse.statusCode == 200) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 200,
          response: locationResponse.response.result.response,
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
          error: "Unable to fetch the location data",
          error_description: "Unable to fetch the location data",
        });
      }
    }
  });

module.exports = router;