var mongoose = require('mongoose');
var User = require('../models/user');

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
    if (err) { res.json(err); }
    else {
      user.__v = undefined;
      user.password = undefined;
      user.email = undefined;
      res.json(user);
    }
  });
};

// POST /api/login
