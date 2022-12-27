
const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');

let current_datetime = new Date();
let formatted_date =
  appendLeadingZeroes(current_datetime.getDate()) +
  '-' +
  appendLeadingZeroes(current_datetime.getMonth() + 1) +
  '-' +
  current_datetime.getFullYear();

// const logDir = `logs/${_envVaribles.JOB_TYPES}/${formatted_date}`;
const logDir = `logs/${formatted_date}`;
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.ensureDirSync(logDir);
}

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return '0' + n;
  }
  return n;
}

const defualtOptions = {
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 10,
  colorize: false
};

const customFormat = winston.format.printf(i => {
  return `${i.level.toUpperCase()}: ${i.timestamp} ${JSON.stringify(i.message)}`;
});

const warnFilter = winston.format((info, opts) => {
  return info.level === 'warn' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const transports = [
  new winston.transports.File(
    Object.assign(
      {
        format: winston.format.combine(errorFilter()),
        filename: path.join(logDir, 'error.log'),
        level: 'error'
      },
      defualtOptions
    )
  ),
  new winston.transports.File(
    Object.assign(
      {
        format: winston.format.combine(warnFilter()),
        filename: path.join(logDir, 'warn.log'),
        level: 'warn'
      },
      defualtOptions
    )
  ),
  new winston.transports.File(
    Object.assign(
      {
        format: winston.format.combine(infoFilter()),
        filename: path.join(logDir, 'info.log'),
        level: 'info'
      },
      defualtOptions
    )
  )
];

const logger = winston.createLogger({
  transports: transports,
  exitOnError: false,
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  exceptionHandlers: [new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'info', // log warn level to console only
      handleExceptions: true,
      json: false,
      colorize: true,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  );
}
  

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = logger;