const Keycloak = require('keycloak-connect');
const session = require('express-session');
const permissionsHelper = require('../helpers/permissionHelper');
const async = require('async')
const roleManager = require('../v1/controllers/support-user-role-management/index.controller');
var logger = require('../utils/loggerUtil');
// let memoryStore = new session.MemoryStore();
const blacklistedDomains = require('../../blacklisted-domains');
const path = require('path');
const { getRefreshToken } = require('../v1/controllers/authentication/login.controller');

/* Set user session using postgres */
const pool = require("../../config/database");
const sqlSession = require("express-mysql-session")(session);
const { connectionConfig } = pool.config;
const connOpt = {
  host: connectionConfig.host,
  port: connectionConfig.port,
  user: connectionConfig.user,
  password: connectionConfig.password,
  database: connectionConfig.database,
  schema: {
    tableName: 'USER_SESSION'
  }
};
const sessionStore = new sqlSession(connOpt);
//


const getKeyCloakClient = (config, store) => {
  logger.generateLogger("info", "{{INITIALIZATION}}", "KEYCLOAK USER ACTION INITIALIZATION", "getKeyCloakClient", { userId: "", userName: "" });
  const keycloak = new Keycloak({ store }, config);
  keycloak.authenticated = authenticated;
  keycloak.deauthenticated = deauthenticated;
  return keycloak
}
const deauthenticated = function (request) {
  let data = { userId: request.session.userId, userName: "" };
  delete request.session['roles']
  delete request.session['rootOrgId']
  delete request.session.userId
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    delete request.session.sessionEvents
  }
  logger.generateLogger("info", "{{DEAUTHENTICATION}}", "KEYCLOAK USER DEAUTHENTICATION EXECUTION", "deauthenticated", data);
}

const authenticated = async function (request, next) {
  let data = { userId: request.session.userId, userName: "" };
  try {
    var userId = request.kauth.grant.access_token.content.sub.split(':')
    request.session.userId = userId[userId.length - 1];
  } catch (err) {
    logger.generateLogger("error", "{{AUTHENTICATED}}", 'userId conversation error :::: ' + request.kauth.grant.access_token.content.sub + "======>" + err, 'authenticated', data);
  }
  try {
    let refresh_token_resp = await getRefreshToken(JSON.parse(request.session["keycloak-token"])["refresh_token"]);
    request.session.refresh_token = refresh_token_resp.result.access_token;
  } catch (er) {
    logger.generateLogger("error", "{{AUTHENTICATED}}", 'refresh token API error :::: ' + JSON.parse(request.session["keycloak-token"])["refresh_token"] + "======>" + er, 'authenticated', data);
  }
  const postLoginRequest = [];
  postLoginRequest.push(function (callback) {
    permissionsHelper.getCurrentUserRoles(request, callback)
  });

  async.series(postLoginRequest, function (err, results) {
    if (err) {
      next(err, null);
    } else {
      next(null, 'loggedin');
    }
  })
}

const isEmailDomainAllowed = function (reqGuard, request, response) {
  response.clearCookie('blockedUser');
  const email = reqGuard.content.email;
  if (email) {
    const [, emailDomain] = email.match(/@(.*)/) || [];
    if (blacklistedDomains.includes(emailDomain)) {
      response.cookie('blockedUser', true);
      response.render(path.join(__dirname, '../../../dist', 'index.ejs'));
      return false;
    }
  }

  return true;
}

module.exports = {
  getKeyCloakClient,
  isEmailDomainAllowed,
  session,
  sessionStore
}
