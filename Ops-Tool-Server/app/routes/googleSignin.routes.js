const router = require('express').Router();
const googleSigninController = require('../v1/controllers/authentication/googleSignin.controller');

router.route('/google/auth').get(googleSigninController.authenticateUserLogin);
router.route('/google/auth/callback').get(googleSigninController.redirectUserAfterLogin);

module.exports = router;
