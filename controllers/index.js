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
    profile: {
      profile_image: "",
      full_name: "",
      gender: "",
      interests: ""
    }
  });

  user.save(function (err) {
    if (err) { res.status(404).send({ message: 'username or password already taken' }); }
    else {
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
      res.status(404).json({ message: 'Invalid username' });
    } else if (user) {

      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) { return next(err); }

        // Password did not match
        if (!isMatch) { res.status(404).json({ message: 'Invalid password' }); }

        var token = jwt.sign(user, config.secret);

        res.status(200).json({
          success: true,
          token: token
        });
      });
    }
  });
};

