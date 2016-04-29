'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment');

// User model
var User = require('../models/user');

var ERROR = [
  'Error: Invalid username',
  'Error: Invalid password',
  'Error: Invalid fields detected'
];

exports.authenticate = function (req, res, next) {
  var username = req.body.username;
  var pwd = req.body.password;

  if (!username || !pwd) {
    res.status(400).json({
      message: ERROR[2]
    });
  }

  var serverConfig = req.app.get('config');

  User.findOne({ 'username': username }, {
    'updatedAt': 0,
    'email': 0,
    '__v': 0
  }, function (err, user) {
    if (err) { return next(err); }

    if (!user) {
      res.status(400).json({
        message: ERROR[0]
      });
    } else if (user) {

      user.verifyPassword(pwd, function (err, isMatch) {
        if (err) { return next(err); }

        // Password did not match
        if (!isMatch) {
          res.status(400).json({
            message: ERROR[1]
          });
        }

        if (serverConfig.secret) {
          var token = jwt.sign(user, serverConfig.secret, {
            expiresIn: moment().add(7, 'days').valueOf()
          });
        }

        // set user as active upon successful login
        user.active = true;

        // remove any unwanted or sensitive fields
        user.password = undefined;

        res.status(200).json({
          token: token,
          user: user
        });
      });
    }
  });
};

