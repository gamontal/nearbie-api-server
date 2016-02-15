var mongoose = require('mongoose');
var User = require('../models/user');

// PUT /api/user/:userId
/*
exports.updateUserInfo = function (req, res, next) {
};
*/

// DELETE /api/user/:userId
exports.deleteUser = function (req, res, next) {
  User.remove({ _id: req.params.userId }, function (err, user) {
    if (err) { return next(err); }
    res.status(200).send({ message: 'user deleted' });
  });
};

// GET /api/user/profile/:username
exports.getProfile = function (req, res, next) {
  User.findOne({ 'username': req.params.username }, { password: 0, email: 0, __v: 0 }, function (err, profile) {
    if (err) { return next(err); }
    res.json(profile);
  });
};

// PUT /api/user/profile/:username
exports.updateProfile = function (req, res, next) {
  var profileInfo = req.body.profile;

  User.update({ username: req.params.username }, { $set: {
    'profile.profile_image': profileInfo.profile_image,
    'profile.full_name': profileInfo.full_name,
    'profile.gender': profileInfo.gender,
    'profile.interests': profileInfo.interests
  }}, function (err, status) {
    if (err) { return next(err); }
    res.status(200).send({ message: 'user profile updated' });
  });
};

