const express = require('express');
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/
let courseController = require('../v1/controllers/courses/index.controller');

/*
** ECREDS CONTROLLER ROUTING
*/

router.route('/list').post(courseController.getCoursesList);
router.route('/download').post(courseController.downloadReport);
router.route('/reports').post(courseController.getReportsSet);

router.get("/search/filter", async function (req, res) {
  let reqHeader = req.headers, data = { userName: reqHeader.username, userId: reqHeader.userid };
    if (req.headers.userid === req.session.userId) {
      try {
        let token = JSON.parse(req.session["keycloak-token"])["access_token"];
        let response = await courseController.getCourseFilter({
          token: token,
          data
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 200,
          response: response,
        });
      } catch (er) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          statusCode: 500,
          error: er.error,
          error_description: er.error_description,
        });
      }
    }
  });

module.exports = router;
