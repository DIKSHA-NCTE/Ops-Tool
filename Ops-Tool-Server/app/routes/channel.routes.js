const express = require('express');
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/

const channelData = require("../v1/controllers/channel/channels.controller");

/*
**CHANNEL CONTROLLER ROUTING
*/
router.route("/read").post(channelData.readChannel);

module.exports = router;
