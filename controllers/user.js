var mongoose = require('mongoose');
var User = require('../models/user');

// GET /api/user/profile/:username
exports.getProfile = function (req, res, next) {
  User.findOne({ 'username': req.params.username }, { password: 0, email: 0, __v: 0 }, function (err, profile) {
    if (err) {
      console.log(err);
      return next(err);
    }

    res.json(profile);
  });
};

/*
  exports.updateProfile = function (req, res, next) {
  };
*/
