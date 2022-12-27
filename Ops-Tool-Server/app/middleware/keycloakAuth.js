const { authenticateKeyCloakLogin, getRefreshToken } = require("../v1/controllers/authentication/login.controller");

const authKeyCloak = async (req, res, next) => {
  let username = JSON.parse(req.body.metaInfo).userName;
  try {
    const authResponse = await authenticateKeyCloakLogin(username);
    if (!authResponse.statusCode == 200 || !authResponse["response"]["token"]) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        statusCode: 401,
        error: "User Unauthorized.",
        message: "Please, try with different user.",
      });
    } else {
      req.body["access_token"] = authResponse["response"]["token"];
      req.body["refresh_token"] = authResponse["response"]["refresh_token"];
      next();
    }
  } catch (er) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({
      statusCode: 401,
      error: "User Unauthorized.",
      message: "Please, try with different user.",
    });
  }
};

const authRefresh = async (req, res, next) => {
  let token;
  if (req.body["refresh_token"]) {
    token = req.body["refresh_token"];
  } else {
    token = JSON.parse(req.session["keycloak-token"])["refresh_token"];
  }
  try {
    const authResponse = await getRefreshToken(token);
    if (
      !authResponse.params.status == "successful" ||
      !authResponse["result"]["access_token"]
    ) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        statusCode: 401,
        error: "User Unauthorized.",
        message: "Please, try with different user.",
      });
    } else {
      req.body["refresh_token"] = authResponse["result"]["access_token"];
      next();
    }
  } catch (er) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({
      statusCode: 401,
      error: "User Unauthorized.",
      message: "Please, try with different user.",
    });
  }
};

module.exports = { authKeyCloak, authRefresh };
