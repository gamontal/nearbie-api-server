var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var BearerStrategy = require('passport-http-bearer').Strategy;
//var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use('local-login', new LocalStrategy(function (username, password, cb) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return cb(err); }

    // No user found with that username
    if (!user) { return cb(null, false); }

    // Make sure the password is correct
    user.verifyPassword(password, function (err, isMatch) {
      if (err) { return cb(err); }

      // Password did not match
      if (!isMatch) { return cb(null, false); }

      // Success
      user.password = undefined;
      user.__v = undefined;
      user.email = undefined;

      return cb(null, user);
    });
  });
}));

passport.use(new LocalStrategy(function (username, password, cb) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return cb(err); }

    // No user found with that username
    if (!user) { return cb(null, false); }

    // Make sure the password is correct
    user.verifyPassword(password, function (err, isMatch) {
      if (err) { return cb(err); }

      // Password did not match
      if (!isMatch) { return cb(null, false); }

      // Success
      return cb(null, user);
    });
  });
}));

exports.isAuthenticated = passport.authenticate('local', { session: false });
exports.loginAuth = passport.authenticate('local-login', { session: false });
