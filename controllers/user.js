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
exports.updateUserInfo = function (req, res, next) {
  var userInfo = req.body;
  User.update({ _id: req.params.userId }, { $set: {
    'email': userInfo.email,
    'username': userInfo.username
  }}, function (err, user) {

    if (err) { return next(err); }

    res.status(200).send({ success: true, message: 'user information updated' });
  });
};

// GET /api/user/profile/:username
exports.getProfile = function (req, res, next) {
  User.findOne({ username: req.params.username }, { password: 0, email: 0, __v: 0, location: 0 }, function (err, profile) {

    if (err) { return next(err); }

    res.status(200).json(profile);
  });
};

// PUT /api/user/profile/:username
exports.updateProfile = function (req, res, next) {
  var profileInfo = req.body;

  User.update({ username: req.params.username }, { $set: {
    'profile.profile_image': profileInfo.profile_image,
    'profile.gender': profileInfo.gender,
    'profile.bio': profileInfo.bio
  }}, function (err, status) {

    if (err) { return next(err); }

    res.status(200).send({ success: true, message: 'user profile updated' });
  });
};

