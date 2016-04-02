/**
 * @module
 * @moduledesc this module contains the application access routes methods.
 */

'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment');

/* Server Configuration */
var serverConfig = require('../config/server-config')[process.env.NODE_ENV || 'development'];

// User model
var User = require('../models/user');

var ERROR = [
  'User validation failed, a user with that username or email address already exists',
  'Invalid username',
  'Invalid password'
];

// GET /api
exports.api = function (req, res) {
  var result = {
    version: require('../package').version
  };

  res.json(result);
};

// POST /api/reqister
exports.register = function (req, res) {
  var userInfo = req.body;

  // create a new user
  var user = new User({
    username: userInfo.username,
    password: userInfo.password,
    email: userInfo.email,
    loc: [userInfo.loc.lng, userInfo.loc.lat],
    profile: {
      profile_image: "",
      gender: "",
      bio: ""
    }
  });

  user.save(function (err) {
    if (err) {
      res.status(400).json({
        message: ERROR[0]
      });
    } else {

      var expires = moment().add(7, 'days').valueOf();

      // generate new token upon registration

      if (process.env.NODE_ENV === 'production') {
        var token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });
      }

      // remove unwanted properties from the response object
      user.updatedAt = undefined;
      user.password = undefined;
      user.__v = undefined;

      res.status(201).json({
        token: token? token : '',
        user: user
      });
    }
  });
};

// POST /api/login
exports.login = function (req, res, next) {
  User.findOne({ username: req.body.username }, {
    __v: 0
  }, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(400).json({
        message: ERROR[1]
      });
    } else if (user) {

      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) {
          return next(err);
        }

        // Password did not match
        if (!isMatch) {
          res.status(400).json({
            message: ERROR[2]
          });
        }

        var expires = moment().add(7, 'days').valueOf();

        var token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });

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

