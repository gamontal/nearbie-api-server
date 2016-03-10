/* Logging Modules */
var FileStreamRotator = require('file-stream-rotator');
var logDirectory = __dirname + '/../log';

module.exports = {
  'logger': FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
  })
};

