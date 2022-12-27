var common = require("../routes/common");
var config = common.config();
var apiConfig = require('../../config/api.config.json');
var supportUsersManagement = require("../v1/controllers/support-user-role-management/index.controller");
const blacklistedDomains = require('../../blacklisted-domains');


const fetchExistingSupportUsersList = async (req, res) => {
  try {
    let result = await supportUsersManagement.getSupportUsersList(req);
    try {
      res.statusCode = "200";
      res.setHeader("Content-Type", "application/json");
      return res.json(result);
    } catch (err) {
      res.statusCode = "500";
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: "500",
        error: err,
        error_description: err
      });
    }
  } catch (error) {
    res.statusCode = "500";
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: "500",
      error: error,
      error_description: error
    });
  }
}

const createNewSupportUser = async (req, res) => {
  try {
    const username = req.body.username;
    if (username) {
      const [, emailDomain] = username.match(/@(.*)/) || [];
      if (blacklistedDomains.includes(emailDomain)) {
        throw 'Invalid domain used for email';
      }
    }

    let result = await supportUsersManagement.insertIntoSupportUsersList(req);
    try {
      res.statusCode = "200";
      res.setHeader("Content-Type", "application/json");
      return res.json(result);
    } catch (err) {
      res.statusCode = "500";
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: "500",
        error: err,
        error_description: err
      });
    }
  } catch (error) {
    res.statusCode = "500";
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: "500",
      error: error,
      error_description: error
    });
  }
}

const updateSupportUser = async (req, res) => {
  try {
    let result = await supportUsersManagement.updateUserInSupportUsersList(req);
    try {
      res.statusCode = "200";
      res.setHeader("Content-Type", "application/json");
      return res.json(result);
    } catch (err) {
      res.statusCode = "500";
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: "500",
        error: err,
        error_description: err
      });
    }
  } catch (error) {
    res.statusCode = "500";
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: "500",
      error: error,
      error_description: error
    });
  }
}

const deleteSupportUser = async (req, res) => {
  try {
    let result = await supportUsersManagement.deleteFromSupportUsersList(req);
    try {
      res.statusCode = "200";
      res.setHeader("Content-Type", "application/json");
      return res.json(result);
    } catch (err) {
      res.statusCode = "500";
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: "500",
        error: err,
        error_description: err
      });
    }
  } catch (error) {
    res.statusCode = "500";
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: "500",
      error: error,
      error_description: error
    });
  }
}

const fetchSupportUser = async (req, res) => {

  try {
    let result = await supportUsersManagement.fetchIndividualSupportUser(req);
    try {
      res.statusCode = "200";
      res.setHeader("Content-Type", "application/json");
      return res.json(result);
    } catch (err) {
      res.statusCode = "500";
      res.setHeader("Content-Type", "application/json");
      return res.json({
        statusCode: "500",
        error: err,
        error_description: err
      });
    }
  } catch (error) {
    res.statusCode = "500";
    res.setHeader("Content-Type", "application/json");
    return res.json({
      statusCode: "500",
      error: error,
      error_description: error
    });
  }
}

module.exports = {
  fetchExistingSupportUsersList,
  createNewSupportUser,
  updateSupportUser,
  deleteSupportUser,
  fetchSupportUser
};
