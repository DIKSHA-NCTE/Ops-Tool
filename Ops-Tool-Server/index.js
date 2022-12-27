"use strict";
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const path = require("path");
const expressValidator = require("express-validator");
const app = express();
const config = require("dotenv").config().parsed;

const winston = require("./config/winston");

var routes = require("./app/routes/index.route");
var userManagementRoutes = require("./app/routes/userManagement.route");
var contentManagementRoutes = require("./app/routes/contents.routes");
var usersRoutes = require("./app/routes/users.routes");
var organizationRoutes = require("./app/routes/organization.routes");
var channelRoutes = require("./app/routes/channel.routes");
var authRoutes = require("./app/routes/authentication.routes");
var certRoutes = require("./app/routes/certificates.routes");
var googleSigninRoutes = require("./app/routes/googleSignin.routes");
var courseRoutes = require("./app/routes/course.routes");
var ssuRoutes = require("./app/routes/selfsignup.routes");
var dashboardRoutes = require("./app/routes/dashboard.routes");
var adminRoutes = require("./app/routes/admin.routes");
var formsRoutes = require("./app/routes/forms.routes");
var submodulesRoutes = require("./app/routes/submodules.routes");
var locationRoutes = require("./app/routes/location.routes");
var serverConfig = require("./config/index").getServerConfig();

var {
  getKeyCloakClient,
  session,
  sessionStore,
  isEmailDomainAllowed,
} = require("./app/helpers/keyCloakHelper");
const validateUserSession = require("./app/middleware/validateUserSession");

const kcConfig = require("./config/index").getKeycloakConfig();

if (config.error) {
  throw config.error;
}

let keycloak = getKeyCloakClient(
  {
    realm: "sunbird",
    "auth-server-url": kcConfig.auth_server_url,
    "ssl-required": "none",
    resource: kcConfig.resource,
    "public-client": false,
    secret: config.SECRET,
  },
  sessionStore
);

app.use(
  session({
    secret: "717b3357-b2b1-4e39-9090-1c712d1b8b64",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 12 * 60 * 60 * 1000 },
  })
);

app.use(keycloak.middleware({ admin: "/callback", logout: "/logout" }));

require("./app/routes/clientRoutes")(app, keycloak, isEmailDomainAllowed);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "uploads")));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-authenticated-user-token, authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(morgan("combined", { stream: winston.stream }));

app.use(expressValidator());

app.use(compression());

app.use("/api/v1/", routes);
app.use("/api/v1/content", validateUserSession, contentManagementRoutes);
app.use("/api/v1/support/users", validateUserSession, userManagementRoutes);
app.use("/api/v1/user", validateUserSession, usersRoutes);
app.use("/api/v1/org", validateUserSession, organizationRoutes);
app.use("/api/v1/channel", validateUserSession, channelRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cert", validateUserSession, certRoutes);
app.use("/api/v1/courses", validateUserSession, courseRoutes);
app.use("/api/v1/ssusers", validateUserSession, ssuRoutes);
app.use("/", googleSigninRoutes);
app.use("/api/v1/dashboard", validateUserSession, dashboardRoutes);
app.use("/api/v1/admin", validateUserSession, adminRoutes);
app.use("/api/v1/form", validateUserSession, formsRoutes);
app.use("/api/v1/submodules", validateUserSession, submodulesRoutes);
app.use("/api/v1/location", validateUserSession, locationRoutes);

app.get("/api/downloadFile/:id", (req, res) => {
  res.send({
    response:
      'Existing Users List is generated. <a href="/csvOutput/' +
      req.params.id +
      '"> Click here </a> to download the CSV file',
  });
});

app.get("*", (req, res) => {
  res.redirect("/dashboard");
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  res.locals.error = req.app.get("env") === "development" ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  res.status(err.status || 500);

  res.json({ error: err.message });
});

const port = serverConfig.port || "3000";

app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
// Exposing an app
module.exports = app;
