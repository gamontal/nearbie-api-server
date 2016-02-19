/**
 * @module
 * @moduledesc this module contains the application access routes methods.
 */

var mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

// GET /api
exports.api = function (req, res) {
    res.json({ message: 'quickee-api' + ' v' + (require('../package').version)});
};

// POST /api/reqister
exports.register = function (req, res, next) {
  var userInfo = req.body;

  var user = new User({
    username: userInfo.username,
    password: userInfo.password,
    email: userInfo.email,
    location: {
      lat: userInfo.location.lat,
      lng: userInfo.location.lng
    },
    profile: {
      profile_image: "",
      gender: "",
      bio: ""
    }
  });

  user.save(function (err) {
    if (err) {
      res.status(400).send({ success: false, message: 'users validation failed' });
    } else {
      user.__v = undefined;
      user.password = undefined;
      user.email = undefined;
      res.status(200).json(user);
    }
  });
};

// POST /api/login
exports.login = function (req, res, next) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) { return next(err); }

    if (!user) {
      res.status(400).json({ message: 'Invalid username' });
    } else if (user) {

      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) { return next(err); }

        // Password did not match
        if (!isMatch) { res.status(400).json({ message: 'Invalid password' }); }

        var token = jwt.sign(user, config.secret);

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

