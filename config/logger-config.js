'use strict';

const winston = require('winston');

let logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/access.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message){
    logger.info(message);
  }
};

module.exports = {
  logger: logger,
  stream: logger.stream
};


