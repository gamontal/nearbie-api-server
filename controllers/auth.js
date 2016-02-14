var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(function (username, password, cb) {
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

exports.isAuthenticated = passport.authenticate('basic', { session: false });

