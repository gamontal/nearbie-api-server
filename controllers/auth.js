/**
 * @module
 * @moduledesc JWT validation module.
 */

'use strict';

var jwt = require('jsonwebtoken');

/* Server Configuration */
var Configuration = require('../config/server-config');
var serverConfig = new Configuration();

var ERROR = [
  'Failed to authenticate token',
  'No token provided'
];

exports.checkForAuthentication = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token']; // takes API token from the request header

  if (token) {
    // compare tokens
    jwt.verify(token, serverConfig.secret, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          message: ERROR[0]
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      message: ERROR[1]
    });
  }
};

