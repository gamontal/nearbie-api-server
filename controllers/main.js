/**
 * @module
 * @moduledesc this module contains the application access routes methods.
 */

'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment');

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
  var serverConfig = req.app.get('config');
  var userInfo = req.body;

  // create a new user
  var user = new User({
    active: true,
    username: userInfo.username,
    password: userInfo.password,
    email: userInfo.email,
    loc: [userInfo.loc.lng, userInfo.loc.lat],
    profile: {
      profile_image: "",
      gender: "",
      status: ""
    }
  });

  user.save(function (err) {
    if (err) {
      res.status(400).json({
        message: ERROR[0]
      });
    } else {

      var expires = moment().add(7, 'days').valueOf(), token;

      // generate new token upon registration
      if (serverConfig.secret) {
        token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });
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
  var serverConfig = req.app.get('config');

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

