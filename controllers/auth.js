/**
 * @module
 * @moduledesc JWT validation module.
 */

'use strict';

var jwt = require('jsonwebtoken');
var config = require('../config/server-config');

exports.checkForAuthentication = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token']; // takes API token from request header

  if (token) {
    // compare tokens
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
};

