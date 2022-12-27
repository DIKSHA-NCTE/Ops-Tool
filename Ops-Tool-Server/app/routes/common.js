// var env = require('../../config/env');

// exports.config = function() {
//   var node_env = process.env.NODE_ENV || 'development';
//   return env[node_env];
// };

const dotenv = require('dotenv');

exports.config = function () {
  const result = dotenv.config({ path: '.env' })

  if (result.error) {
    throw result.error
  }

  return result.parsed;
};