const { google } = require('googleapis');
const _ = require('lodash');
const request = require('request-promise');
const uuid = require('uuid/v1');
const dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');
const googleCredentials = require('../../credentials.json');
const redirectPath = '/google/auth/callback';
const defaultScope = ['https://www.googleapis.com/auth/userinfo.email', 'openid', 'email', 'profile', 'https://www.googleapis.com/auth/userinfo.profile'];
const common = require('../routes/common');
const config = common.config();
const { getKeyCloakClient } = require('./keyCloakHelper');
const kcConfig = require('../../config/index').getKeycloakConfig();
const logger = require('../../config/winston');

const keycloakGoogle = getKeyCloakClient({
    resource: kcConfig.resource,
    bearerOnly: true,
    serverUrl: kcConfig.auth_server_url,
    realm: 'sunbird',
    credentials: {
        secret: process.env.secretKey
    }
});

class GoogleOauth {
    createConnection(req) {
        const {
            installed: {
                client_id,
                client_secret
            }
        } = googleCredentials;

        const redirect = `${req.protocol}://${req.get('host')}${redirectPath}`;
        return new google.auth.OAuth2(client_id, client_secret, redirect);
    }
    generateAuthUrl(req) {
        const connection = this.createConnection(req);
        return connection.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: defaultScope
        });
    }
    async getProfile(req) {
        const client = this.createConnection(req);
        if (req.query.error === 'access_denied') {
            throw new Error('GOOGLE_ACCESS_DENIED');
        }
        const { tokens } = await client.getToken(req.query.code).catch(this.handleError);
        client.setCredentials(tokens);
        const tokenInfo = jwt.decode(tokens.id_token);
        let userInfo = {
            email: tokenInfo.email,
            name: tokenInfo.name
        };

        if (!_.get(userInfo, 'name') || !_.get(userInfo, 'email')) {
            const oauth2 = google.oauth2({
                auth: client,
                version: 'v2'
            });
            const googleProfileFetched = await oauth2.userinfo.get().catch(this.handleError) || {};
            userInfo = googleProfileFetched.data || {};
            logger.info(`userInformation fetched from oauth2 api ${userInfo}`);
        }

        return {
            name: userInfo.name,
            emailId: userInfo.email
        }
    }

    handleError(error) {
        logger.info(`googleOauthHelper: getProfile failed ${error}`);
        if (_.get(error, 'response.data')) {
            throw error.response.data
        } else if (error instanceof Error) {
            throw error.message
        } else {
            throw 'unhandled exception while getting tokens'
        }
    }
}

const googleOauth = new GoogleOauth();
const createSession = async (emailId, reqQuery, req, res) => {
    let keycloakClient = keycloakGoogle;
    let scope = 'openid';
    let grant = await keycloakClient.grantManager.obtainDirectly(emailId, undefined, undefined, scope).catch(function (error) {
        logger.info(`googleOauthHelper: createSession failed ${error}`);
        throw 'unable to create session';
    });

    keycloakClient.storeGrant(grant, req, res);
    req.kauth.grant = grant;

    return new Promise((resolve, reject) => {
        keycloakClient.authenticated(req, function (error) {
            if (error) {
                logger.info(`googleauthhelper:createSession error creating session ${error}`);
                reject('GOOGLE_CREATE_SESSION_FAILED')
            } else {
                resolve({ access_token: grant.access_token.token, refresh_token: grant.refresh_token.token })
            }
        });
    })
}

const fetchUserByEmailId = async (emailId, req) => {
    const options = {
        method: 'GET',
        url: `${config.BASE}${config.SUB_URL.API}user/v1/exists/email/${emailId}`,
        headers: getHeaders(req),
        json: true
    }

    return request(options).then(data => {
        if (data.responseCode === 'OK') {
            return _.get(data, 'result.exists');
        } else {
            logger.error(`googleOauthHelper: fetchUserByEmailId failed ${JSON.stringify(data)}`);
            throw new Error(_.get(data, 'params.errmsg') || _.get(data, 'params.err'));
        }
    })
}

const getHeaders = (req) => {
    return {
        // 'x-device-id': req.get('x-device-id'),
        'x-msgid': uuid(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': config.API_KEY
    }
}
module.exports = { googleOauth, createSession, fetchUserByEmailId };