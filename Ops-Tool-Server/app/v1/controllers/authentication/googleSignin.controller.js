const _ = require('lodash');
const { googleOauth, createSession, fetchUserByEmailId } = require('../../../helpers/googleOauthHelper');
const logger = require('../../../../config/winston');

const authenticateUserLogin = (req, res) => {
    logger.info('google auth called');
    if (!req.query.client_id || !req.query.redirect_uri || !req.query.error_callback) {
        res.redirect('/')
        return;
    }
    const { state } = req.query;

    logger.info(`query params state ${state}`);
    let googleAuthUrl = `${googleOauth.generateAuthUrl(req)}&state=${state}`;
    logger.info(`redirect google to ${JSON.stringify(googleAuthUrl)}`);
    res.redirect(googleAuthUrl);
}

const redirectUserAfterLogin = async (req, res) => {
    logger.info('google auth callback called');
    const reqQuery = _.pick(req.query, ['scope', 'state']);
    let googleProfile, isUserExist, keyCloakToken, redirectUrl, errType;
    try {
        if (!reqQuery.state || !reqQuery.scope) {
            errType = 'MISSING_QUERY_PARAMS';
            throw 'some of the query params are missing';
        }
        errType = 'GOOGLE_PROFILE_API';
        googleProfile = await googleOauth.getProfile(req).catch(handleGoogleProfileError);
        logger.info(`googleProfile fetched ${JSON.stringify(googleProfile)} `);

        errType = 'USER_FETCH_API';
        isUserExist = await fetchUserByEmailId(googleProfile.emailId, req).catch(handleGetUserByIdError);
        logger.info(`user profile fetched ${JSON.stringify(isUserExist)} `);
        if (!isUserExist) {
            throw 'user not found';
        }

        errType = 'KEYCLOAK_SESSION_CREATE';
        keyCloakToken = await createSession(googleProfile.emailId, reqQuery, req, res).catch(handleCreateSessionError);
        logger.info(`keyCloakToken fetched`);// ${JSON.stringify(keyCloakToken)}`);

        errType = 'UNHANDLED_ERROR';
        logger.info(`google sign in success ${JSON.stringify({ googleProfile, isUserExist })}`);
    } catch (error) {
        // if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['scope', 'state']);
        queryObj.error_message = getErrorMessage(error);
        redirectUrl = '/' + getQueryParams(queryObj);
        console.log(redirectUrl);
        // }
        logger.error(`google sign in failed error: ${error}, ${JSON.stringify({ errType, googleProfile, isUserExist, redirectUrl })}`);
    } finally {
        logger.info(`redirecting to ${redirectUrl}`);
        res.redirect(redirectUrl || '/');
    }
}

const getQueryParams = (queryObj) => {
    return '?' + Object.keys(queryObj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
        .join('&');
}

const getErrorMessage = (error) => {
    if (error === 'USER_NAME_NOT_PRESENT' || _.get(error, 'message') === 'USER_NAME_NOT_PRESENT') {
        return 'Your account could not be created due to your Google Security settings';
    } else if (error === 'GOOGLE_ACCESS_DENIED' || _.get(error, 'message') === 'GOOGLE_ACCESS_DENIED') {
        return 'Your account could not be created due to your Google Security settings';
    } else if (_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
        return 'User account is blocked. Please contact admin';
    } else {
        return 'Your account could not be signed in due to technical issue. Please try again after some time';
    }
}

const handleCreateSessionError = (error) => {
    logger.info(`ERROR_CREATING_SESSION ${error}`);
    throw error.error || error.message || error;
};

const handleGoogleProfileError = (error) => {
    logger.info(`ERROR_FETCHING_GOOGLE_PROFILE ${error}`);
    throw error.error || error.message || error;
};

const handleGetUserByIdError = (error) => {
    if (_.get(error, 'error.params.err') === 'USER_NOT_FOUND' || _.get(error, 'error.params.status') === 'USER_NOT_FOUND') {
        return {};
    }
    throw error.error || error.message || error;
}

module.exports = { authenticateUserLogin, redirectUserAfterLogin };