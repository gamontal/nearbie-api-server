'use strict';

var jwt = require('jsonwebtoken');
var fetchZipcode = require('../lib/fetch_zipcode');
var moment = require('moment');

// User model
var User = require('../models/user');

var ERROR = [
  'User validation failed, a user with that username or email address already exists'
];

exports.register = function (req, res) {
  var serverConfig = req.app.get('config');
  var coords = [req.body.loc.lng, req.body.loc.lat];
  var zipcode = fetchZipcode(coords);

  // create a new user
  var user = new User({
    active: true,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    loc: coords,
    loc_attr: {
      zipcode: zipcode
    },
    profile: {
      profile_image: "",
      gender: "",
      status: ""
    },
    blocked_users: []
  });

  user.save(function (err) {
    if (err) {
      res.status(400).json({
        message: ERROR[0]
      });
    } else {

      var expires = moment().add(7, 'days').valueOf(), token;

      // generate new token upon registration
      if (serverConfig.secret) {
        token = jwt.sign(user, serverConfig.secret, { expiresIn: expires });
      }

      // remove unwanted properties from the response object
      user.updatedAt = undefined;
      user.password = undefined;
      user.loc_attr = undefined;
      user.__v = undefined;

      res.status(201).json({
        token: token? token : '',
        user: user
      });
    }
  });
};

