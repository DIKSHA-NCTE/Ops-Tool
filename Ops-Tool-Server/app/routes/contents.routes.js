const express = require("express");
const router = express.Router();
/*
Module:multer
multer is middleware used to handle multipart form data
*/
let upload = require("../../config/multer.config");
let validator = require("../middleware/validators");
const { authKeyCloak, authRefresh } = require("../middleware/keycloakAuth");

const loggRouter = require("../middleware/middleware");

// const privateUpdateControllerV3 = require("../v1/controllers/content-bulk-upload/updatePrivateContent.controller");
// const localContentsCreateController = require("../v1/controllers/content-bulk-upload/localCreateContent.controller");

const contentStatusController = require("../v1/controllers/contents/contentStatus.controller");
const contentData = require("../v1/controllers/contents/contents.controller");

const indexControllerV1 = require("../v1/controllers/content-bulk-upload/index.controller");
const broadcastControllerV1 = require("../v1/controllers/content-bulk-upload/broadcast.controller");

const shallowController = require("../v1/controllers/shallow-copy/index.controller");
const shallowCopyStatus = require("../v1/controllers/shallow-copy/shallowCopyStatus.controller");

/*
 **CONTENTS CONTROLLER ROUTING
 */
router.route("/list").post(contentData.SearchContents);
router.route("/upload/status").post(contentStatusController.checkContentStatus);
router
  .route("/upload/status/list")
  .post(contentStatusController.contentBatchStatusList);

router
  .route("/broadcast/upload/status")
  .post(contentStatusController.checkBroadcastContentStatus);
router
  .route("/broadcast/upload/status/list")
  .post(contentStatusController.BroadcastcontentBatchStatusList);

/*
 **CONTENT BULK UPLOAD CONTROLLER ROUTING
 */
router
  .route("/getContent")
  .post(
    upload.single("file"),
    authKeyCloak,
    validator.validateExcel,
    indexControllerV1.initContentBulkUpload
  );

router
  .route("/broadcastContent")
  .post(
    upload.single("file"),
    authKeyCloak,
    validator.validateExcel,
    broadcastControllerV1.initContentBulkUpload
  );

/*
 **CONTENT SHALLOW COPY CONTROLLER ROUTING
 */
router 
    .route("/contentShallowCopy")
    .post(
      upload.single("file"),
      authKeyCloak,
      authRefresh,
      validator.validateExcel,
      shallowController.initShallowCopy
    )

router.route("/shallowCopy/upload/status").post(shallowCopyStatus.shallowCopyContentStatus);
router
    .route("/shallowCopy/status/list")
    .post(shallowCopyStatus.shallowCopyBatchStatusList);

//CONTENT SEARCH FILTER ROUTING
router.route("/list/search/filter").get(contentData.getFilterData)
router.route("/upload/search/filter").get(contentData.getFilterData)
router.route("/upload_status/search/filter").get(contentData.getFilterData)
router.route("/batch_upload_list/search/filter").get(contentData.getFilterData)

/*
 **LOCAL CONTENT BULK UPLOAD CONTROLLER ROUTING
 */
// router.route('/local/content/upload').post(upload.single('file'), validator.validateExcel, localContentsCreateController.initContent);

module.exports = router;
