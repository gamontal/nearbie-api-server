/**
 * @module
 * @moduledesc this module contains the user routes methods.
 */

var mongoose = require('mongoose');
var User = require('../models/user');

// GET /api/user/:username
exports.getUserInfo = function (req, res, next) {
  User.findOne({ username: req.params.username }, { password: 0, __v: 0 }, function (err, user) {

    if (err) { return next(err); }

    res.status(200).json(user);
  });
};

// DELETE /api/user/:userId
exports.deleteUser = function (req, res, next) {
  User.remove({ _id: req.params.userId }, function (err, user) {

    if (err) { return next(err); }

    res.status(200).send({ success: true, message: 'user deleted' });
  });
};

// PUT /api/user/:userId
// NOTE it is debatable whether or not to send the user's object in the payload or as a query
exports.updateUserInfo = function (req, res, next) {
  var userInfo = req.body;

  User.findOne({ _id: req.params.userId }, function (err, user) {
    if (err) { return next(err); }

    if (!user) {
      res.status(404).send({ success: false, message: 'user doesn\'t exist' });
    } else if (user) {

      user.username = userInfo.username;
      user.password = userInfo.password;
      user.email = userInfo.email;

      user.save(function (err) { // catch validation error and return response to the client
        if (err) {
          res.status(400).send({ success: false, message: 'user validation failed' });
        } else {
          res.status(200).send({ success: true, message: 'user information updated' });
        }
      });

    }
  });
};

/* GET /api/location
exports.updateUserLocation = function (req, res, next) {
};
*/

// GET /api/user/profile/:username
exports.getProfile = function (req, res, next) {
  User.findOne({ username: req.params.username }, {
    // remove unwanted or sensitive fields
    password: 0,
    email: 0,
    __v: 0,
    loc: 0
  }, function (err, profile) {

    if (err) { return next(err); }

    res.status(200).json(profile);
  });
};

// PUT /api/user/profile/:username
exports.updateProfile = function (req, res, next) {
  var profileInfo = req.body;

  User.findOne({ username: req.params.username }, function (err, user) {

    if (err) { return next(err); }

    if (!user) {
      res.status(404).send({ success: false, message: 'user doesn\'t exist' });
    } else if (user) {

      user.profile.profile_image = profileInfo.profile_image,
      user.profile.gender = profileInfo.gender,
      user.profile.bio = profileInfo.bio

      user.save();

      res.status(200).send({ success: true, message: 'user profile updated' });
    }
  });
};

