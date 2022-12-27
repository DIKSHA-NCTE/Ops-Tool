const configs = require(`./config.${process.env.NODE_ENV || "development"}`);

module.exports.getDatabaseConfig = function () {
    return configs.database;
}

module.exports.getServerConfig = function () {
    return configs.server;
}

module.exports.getKeycloakConfig = function () {
    return configs.keycloak;
}