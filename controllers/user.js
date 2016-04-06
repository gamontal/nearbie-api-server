/**
 * @module
 * @moduledesc this module contains the user routes methods.
 */

'use strict';

var fs = require('fs');
var moment = require('moment');
var cloudinary = require('cloudinary');

var User = require('../models/user'); // User Model

var INFO = [
  'User deleted',
  'User information updated',
  'User location updated',
  'User profile updated'
];

var ERROR = [
  'User doesn\'t exist',
  'Invalid user ID',
  'User validation failed'
];

/* GET /api/users/:username */
exports.getUser = function (req, res, next) {
  User.findOne({ username: req.params.username }, {
    password: 0,
    __v: 0,
    updatedAt: 0
  }).lean().exec(function (err, user) {

    if (err) { return next(err); }

    if (!user) {
      res.status(404).json({
        message: ERROR[0]
      });
    } else if (user) {

      user.loc = {
        lng: user.loc[0],
        lat: user.loc[1]
      };

      res.status(200).json(user);
    }
  });
};

/* DELETE /api/users/:userid */
exports.deleteUser = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {
    User.remove({ _id: req.params.userid }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {
        res.status(200).json({
          message: INFO[0]
        });
      }
    });
  } else {
    res.status(400).json({
      message: ERROR[1]
    });
  }
};

/* PUT /api/users/:userid */
exports.updateUser = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {

    var NEW_USER_INFO = req.body; // the received user object

    User.findOne({ _id: req.params.userid }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {

        user.active = NEW_USER_INFO.active? true : false;
        user.username = NEW_USER_INFO.username || user.username;
        user.password = NEW_USER_INFO.password || user.password;
        user.email = NEW_USER_INFO.email || user.email;

        // catch validation error and return response to the client
        user.save(function (err) {
          if (err) {
            res.status(400).json({
              message: ERROR[2]
            });
          } else {
            res.status(200).json({
              message: INFO[1]
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      message: ERROR[1]
    });
  }
};

/* POST /api/users/:userid/location */
exports.updateUserLocation = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {

    // store new coordenates
    User.findOne({ _id: req.params.userid }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {

        user.loc = [req.body.lng, req.body.lat];

        user.save(function (err) {
          if (err) {
            res.status(400).json({
              message: ERROR[2]
            });
          } else {
            res.status(200).json({
              message: INFO[2]
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      message: ERROR[1]
    });
  }
};

// NOTE this method returns an empty array if no users were found with nearby coordinates
/* PUT /api/users/:userid/location */
exports.getNearbyUsers = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {

    var userid = req.params.userid;

    // store new coordinates
    User.findOne({ _id: userid }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {

        user.loc = [req.body.lng, req.body.lat]; // add new coordinates

        // save changes
        user.save(function (err) {
          if (err) {
            res.status(400).json({
              message: ERROR[2]
            });
          }
        });

        // sets radius
        var maxDistance = req.body.maxDistance || 2;

        // convert the distance to radius
        maxDistance /= 6371;

        var coords = [];
        coords[0] = req.body.lng;
        coords[1] = req.body.lat;

        // inactivity max time limit value (in hours);
        var inactiveTimeLimit = 5;

        // query for nearby users
        User.aggregate([
          {
            '$geoNear': {
              'near': coords,
              'distanceField': 'calculated_distance',
              'maxDistance': maxDistance,
              'spherical': false
            }
          },
          {
            '$match': {
              'updatedAt': {
                '$gte': new Date(new Date().setHours(new Date().getHours() - inactiveTimeLimit)),
                '$lte': new Date()
              }
            }
          },
          {
            '$project': {
              '_id': 1,
              'updatedAt': 1,
              'active': 1,
              'was_active': 1,
              'username': 1,
              'loc': 1,
              'profile': 1
            }
          }
        ], function (err, users) {
          if (err) { return next(err); }

          // this removes the current user from the results array
          users.forEach(function (elem, index) {
            if (elem._id == userid) {
              users.splice(index, 1);
            }
          });

          // modifies location properties and was_active string
          for (var key in users) {
            users[key].was_active = moment(users[key].was_active).fromNow();

            users[key].loc = {
              lng: users[key].loc[0],
              lat: users[key].loc[1]
            };
          }

          res.status(200).json(users);
        });
      }
    });
  } else {
    res.status(400).json({
      message: ERROR[1]
    });
  }
};

// NOTE upload image to cloudinary from the client
/* PUT /api/users/:username/profile */
exports.updateUserProfile = function (req, res, next) {

  var NEW_PROFILE_INFO = req.body;

  User.findOne({ username: req.params.username }, function (err, user) {

    if (err) { return next(err); }

    if (!user) {
      res.status(404).send({
        message: ERROR[0]
      });
    } else if (user) {

      // verify image
      if (typeof req.file === 'undefined') {
        user.profile.profile_image = 'http://res.cloudinary.com/dvicgeltx/image/upload/v1457815397/l3ayih0vef7hkgtcttnd.jpg';
        user.save();
      } else if (req.file) {
        cloudinary.uploader.upload(req.file.path, function (result) {
          user.profile.profile_image = result.secure_url;
          user.save();
        });

        // remove user image
        fs.unlink(req.file.path, function(err) {
          if (err) {
            return next(err);
          }
        });
      }

      user.profile.gender = NEW_PROFILE_INFO.gender || user.profile.gender;
      user.profile.status = NEW_PROFILE_INFO.status || user.profile.status;

      user.save(function (err) {
        if (err) { return next(err); }
      });

      res.status(200).json({
        message: INFO[3]
      });
    }
  });
};

