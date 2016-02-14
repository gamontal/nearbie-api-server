var mongoose = require('mongoose');
var User = require('../models/user');

// GET /api
exports.api = function (req, res) {
    res.json({ message: 'quickee-api' + ' v' + (require('../package').version)});
};

// POST /api/user/reqister
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

// POST api/login
exports.login = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username, upwd: password }, { password: 0, __v: 0 }, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    if (!user) {
      return res.status(404).send();
    }

    req.session.user = user;
    return res.status(200).json(user)
  });
};

