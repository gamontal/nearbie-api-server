/**
 * @module
 * @moduledesc JWT validation module.
 */

'use strict';

var jwt = require('jsonwebtoken');
var serverConfig = require('../config/server-config')[process.env.NODE_ENV || 'production'];

exports.checkForAuthentication = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token']; // takes API token from the request header

  if (token) {
    // compare tokens
    jwt.verify(token, serverConfig.secret, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      message: 'No token provided'
    });
  }
};

