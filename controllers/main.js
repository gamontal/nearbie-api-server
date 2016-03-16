/**
 * @module
 * @moduledesc this module contains the application access routes methods.
 */

'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var serverConfig = require('../config/server-config');

var User = require('../models/user'); // user model

// GET /api
exports.api = function (req, res) {
    res.json({ message: 'quickee-api' + ' v' + (require('../package').version)});
};

// POST /api/reqister
exports.register = function (req, res, next) {
  var userInfo = req.body;

  // create a new user
  var user = new User({
    username: userInfo.username,
    password: userInfo.password,
    email: userInfo.email,
    loc: userInfo.loc,
    profile: {
      profile_image: "",
      gender: "",
      bio: ""
    }
  });

  user.save(function (err) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Validation failed, a user with that username or email address already exists.'
      });
    } else {

      // remove unwanted properties from the response object
      user.__v = undefined;
      user.password = undefined;
      user.email = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;

      res.status(201).json(user);
    }
  });
};

// POST /api/login
exports.login = function (req, res, next) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid username' });
    } else if (user) {

      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) {
          return next(err);
        }

        // Password did not match
        if (!isMatch) {
          res.status(400).json({ success: false, message: 'Invalid password' });
        }

        var expires = moment().add('days', 7).valueOf();
        var token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });

        // remove any unwanted or sensitive fields
        user.password = undefined;
        user.__v = undefined;

        res.status(200).json({
          success: true,
          token: token,
          user: user
        });
      });
    }
  });
};

