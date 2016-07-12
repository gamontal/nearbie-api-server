/**
 * @module
 * @moduledesc JWT validation module.
 */

'use strict';

var jwt = require('jsonwebtoken');

var ERROR = [
  'Error: Failed to authenticate token',
  'Error: No token provided'
];

exports.checkForAuthentication = function (req, res, next) {
  var serverConfig = req.app.get('config');

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

