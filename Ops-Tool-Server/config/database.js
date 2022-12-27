const configData = require("./index");
var mysql = require('mysql');

const dbConfig = configData.getDatabaseConfig();

var pool = mysql.createPool({
    connectionLimit: dbConfig.connectionLimit,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection) connection.release();
    return;
});

module.exports = pool;