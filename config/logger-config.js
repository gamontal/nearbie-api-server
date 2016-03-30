'use strict';

var FileStreamRotator = require('file-stream-rotator');

module.exports = function (logDirectory) {
  return ({
    logger: FileStreamRotator.getStream({
      date_format: 'YYYYMMDD',
      filename: logDirectory + '/access-%DATE%.log',
      frequency: 'daily',
      verbose: false
    })
  });
};

