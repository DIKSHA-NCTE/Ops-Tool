var request = require('request');
var logger = require('../../../utils/loggerUtil');
var async = require('async');
var common = require('../../../routes/common');
var config = common.config();
var apiConfig = require('../../../../config/api.config.json');
const validatorUtil = require("../../../utils/validatorUtil");
var moment = require('moment');


const keycloakAPI = (req) => {
    var options = {
        'method': 'POST',
        'url': `${config.BASE}${apiConfig.KEYCLOAK.LOGIN}`,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=${config.RESOURCE}&username=${req}&grant_type=password&password=&client_secret=${config.SECRET}`
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (error) {
                reject(error);
                throw new Error(error);
            }
            let body = JSON.parse(response.body);
            if (body.error == "invalid_grant") {
                reject(body);
            }
            resolve(body);
        });
    });
};

const getKeycloakToken =  (req, res) => {
    if (req.body.type == '1') {
        if (typeof req.session['keycloak-token'] !== 'undefined') {
            res.setHeader("Content-Type", "application/json");
            return res.json({
                "statusCode": 200,
                "response": {
                    "expires": validatorUtil.formatMomentDateTime(moment(req.session.cookie._expires)),
                    "token": JSON.parse(req.session['keycloak-token']).access_token.trim(),
                    "refresh_token": req.session.refresh_token.trim()
                }
            })
        } else {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 401;
            return res.json({
                "statusCode": 401,
                "error": "Your session is expired.",
                "message": "Please login again."
            })
        }
    } else if (req.body.type == '2') {
        keycloakAPI(req.body.value.value.trim()).then(response => {
            if (response['access_token'] && response['refresh_token']) {
                getRefreshToken(response['refresh_token'].trim()).then(resp => {
                    if (resp.result['access_token']) {
                        res.setHeader("Content-Type", "application/json");
                        return res.json({
                            "statusCode": 200,
                            "response": {
                                "expires": validatorUtil.formatMomentDateTime(moment().add(12, 'hours')),
                                "token": response['access_token'].trim(),
                                "refresh_token": resp.result['access_token'].trim()
                            }
                        })
                    }
                }).catch(er => {
                    res.setHeader("Content-Type", "application/json");
                    return res.json({
                        "statusCode": 200,
                        "response": {
                            "expires": validatorUtil.formatMomentDateTime(moment().add(12, 'hours')),
                            "token": response['access_token'].trim(),
                            "refresh_token": "Error getting refresh token",
                            "error": er
                        }
                    })
                });
            }
        }).catch(er => {
            res.setHeader("Content-Type", "application/json");
            res.status(400);
            return res.json({
                "statusCode": 400,
                "error": er
            })
        });
    }
};

const authenticateKeyCloakLogin = async (req) => {
    return new Promise(async function (resolve, reject) {
        keycloakAPI(req).then(response => {
            if (response['access_token']) {
                resolve({
                    "statusCode": 200,
                    "response": {
                        "expires": validatorUtil.formatMomentDateTime(moment().add(12, 'hours')),
                        "token": response['access_token'].trim(),
                        "refresh_token": response['refresh_token'].trim()
                    }
                })
            }
        }).catch(er => {
            reject({
                "statusCode": 400,
                "error": er
            })
        });
    })
}

const getRefreshToken = async (keycloak_refresh_token) => {
    var options = {
      'method': 'POST',
      'url': config.BASE + apiConfig.SUB_URL.AUTH + '/' + apiConfig.SUB_URL.V1 + apiConfig.APIS.REFRESH_TOKEN,
      'headers': {
        'Authorization': config.API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'refresh_token': keycloak_refresh_token
      }
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (error) {
                reject(error);
                throw new Error(error);
            }
            let body = JSON.parse(response.body);
            if (body.error == "invalid_grant") {
                reject(body);
            }
            resolve(body);
        });
    });
  }

module.exports = { getKeycloakToken, authenticateKeyCloakLogin, getRefreshToken };