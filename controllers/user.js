/**
 * @module
 * @moduledesc this module contains the user routes methods.
 */

var fs = require('fs');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');

var User = require('../models/user'); // User Model

// GET /api/users/:username
exports.getUserInfo = function (req, res, next) {
  User.findOne({ username: req.params.username }, { password: 0, __v: 0 }, function (err, user) {
    if (err) { return next(err); }

    if (!user) {
      res.status(404).json({ success: false, message: 'User doesn\'t exist' });
    } else if (user) {
      res.status(200).json(user);
    }
  });
};

// DELETE /api/users/:userid
exports.deleteUser = function (req, res, next) {
  User.remove({ _id: req.params.userid }, function (err, user) {
    if (err) {
      return next(err);
    }

    res.status(200).json({ success: true, message: 'User deleted' });
  });
};

exports.updateUserInfo = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {
    var userInfo = req.body;

    User.findOne({ _id: req.params.userid }, function (err, user) {
      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({ success: false, message: 'User doesn\'t exist' });
      } else if (user) {

        user.username = userInfo.username;
        user.password = userInfo.password;
        user.email = userInfo.email;

        user.save(function (valErr) { // catch validation error and return response to the client
          if (valErr) {
            res.status(400).json({ success: false, message: 'User validation failed' });
          } else {
            res.status(200).json({ success: true, message: 'User information updated' });
          }
        });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'Invalid user id' })
  }
};

// POST /api/users/:userid/location
exports.updateUserLocation = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {

    // store new coordenates
    User.findOne({ _id: req.params.userid }, function (err, user) {
      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({ success: false, message: 'User doesn\'t exist' });
      } else if (user) {

        user.loc = [req.body.lng, req.body.lat];

        user.save(function (valErr) { // catch validation error and return response to the client
          if (valErr) {
            res.status(400).json({ success: false, message: 'User validation failed' });
          } else {
            res.status(200).json({ success: true, message: 'User location updated' });
          }
        });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'Invalid user id' });
  }
};

// PUT /api/users/:userid/location
// NOTE returns an empty array if no users were found with nearby coordinates
exports.getNearbyUsers = function (req, res, next) {
  if (req.params.userid.match(/^[0-9a-fA-F]{24}$/)) {
    var userid = req.params.userid;

    // store new coordinates
    User.findOne({ _id: userid }, function (err, user) {
      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({ success: false, message: 'user doesn\'t exist'});
      } else if (user) {

        user.loc = [req.body.lng, req.body.lat]; // add new coordinates

        // save changes
        user.save(function (valErr) {
          if (valErr) {
            res.status(400).json({ success: false, message: 'User validation failed' });
          }
        });

        // sets radius
        var maxDistance = req.body.maxDistance || 2;

        // convert the distance to radius
        maxDistance /= 6371;

        var coords = [];
        coords[0] = req.body.lng;
        coords[1] = req.body.lat;

        // query for nearby users
        User.find({
          loc: {
            $near: coords,
            $maxDistance: maxDistance
          }
        }, { password: 0, __v: 0 }).exec(function (err, users) {

          if (err) {
            return next(err);
          }

          // this removes the current user from the results array
          // NOTE mongoose doesn't provide this type of functionality (excluding a specific user from a query)
          // looping through the users array and eliminating the user's object is the only feasible solution I could find
          users.forEach(function (elem, index) {
            if (elem._id == userid) {
              users.splice(index, 1);
            }
          });

          res.status(200).json(users);
        });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'Invalid user id' });
  }
};

// GET /api/users/:username/profile
exports.getUserProfile = function (req, res, next) {
  User.findOne({ username: req.params.username }, {
    // remove unwanted or sensitive fields
    password: 0,
    email: 0,
    __v: 0,
    loc: 0
  }, function (err, profile) {
    if (err) { return next(err); }

    if (!profile) {
      res.status(404).json({ success: false, message: 'User doesn\'t exists' });
    } else {
      res.status(200).json(profile);
    }
  });
};

// PUT /api/users/:username/profile
exports.updateUserProfile = function (req, res, next) {
  var newProfileInfo = req.body;

  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) { return next(err); }

    if (!user) {
      res.status(404).send({ success: false, message: 'User doesn\'t exist' });
    } else if (user) {

      if (req.file === undefined) {
        user.profile.profile_image = 'http://res.cloudinary.com/dvicgeltx/image/upload/v1457699376/profile_image_placeholder_dwdms9.jpg';
      } else {
        cloudinary.uploader.upload(req.file.path, function (result) {
          user.profile.profile_image = result.secure_url;
        });

        // remove user image
        fs.unlink(req.file.path, function(err) {
          if (err) {
            return next(err);
          }
        });
      }

      user.profile.gender = newProfileInfo.gender;
      user.profile.bio = newProfileInfo.bio;

      user.save(function (err) {
        if (err) {
          return next(err);
        }
      });
      res.status(200).send({ success: true, message: 'User profile updated' });
    }
  });
};

