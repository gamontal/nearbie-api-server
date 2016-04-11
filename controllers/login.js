'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment');

// User model
var User = require('../models/user');

var ERROR = [
  'Invalid username',
  'Invalid password'
];

exports.login = function (req, res, next) {
  var serverConfig = req.app.get('config');

  User.findOne({ 'username': req.body.username }, {
    '__v': 0
  }, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(400).json({
        message: ERROR[0]
      });
    } else if (user) {

      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) {
          return next(err);
        }

        // Password did not match
        if (!isMatch) {
          res.status(400).json({
            message: ERROR[1]
          });
        }

        var expires = moment().add(7, 'days').valueOf();

        var token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });

        // set user as active upon successful login
        user.active = true;

        // remove any unwanted or sensitive fields
        user.updatedAt = undefined;
        user.password = undefined;
        user.email = undefined;

        res.status(200).json({
          token: token,
          user: user
        });
      });
    }
  });
};
