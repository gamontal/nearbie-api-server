/**
 * @module
 * @moduledesc this module contains the user routes methods.
 */

'use strict';

var fs = require('fs');
var fetchZipcode = require('../lib/fetch_zipcode');
var cloudinary = require('cloudinary');

var User = require('../models/user'); // User Model

var INFO = [
  'User deleted',
  'User information updated',
  'User location updated',
  'User profile updated',
  'New blocked user added',
  'User already blocked',
  'Removed blocked users'
];

var ERROR = [
  'Error: User doesn\'t exist',
  'Error: Invalid user ID',
  'Error: User validation failed'
];

var USER_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

/* GET /api/users/:username */
exports.getUser = function (req, res, next) {
  User.findOne({ 'username': req.params.username }, {
    'active': 0,
    'updatedAt': 0,
    'password': 0,
    'email': 0,
    'loc_attr': 0,
    '__v': 0
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

/* DELETE /api/users/:user_id */
exports.deleteUser = function (req, res, next) {
  if (!req.params.user_id.match(USER_ID_PATTERN)) {
    res.status(400).json({ message: ERROR[1] });
  } else {
    User.remove({ '_id': req.params.user_id }, function (err, user) {

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
  }
};

/* PUT /api/users/:user_id */
exports.updateUser = function (req, res, next) {
  if (!req.params.user_id.match(USER_ID_PATTERN)) {
    res.status(400).json({
      message: ERROR[1]
    });
  } else {
    var NEW_USER_INFO = req.body; // the received user object

    User.findOne({ '_id': req.params.user_id }, function (err, user) {

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
  }
};

/* POST /api/users/:user_id/location */
exports.updateUserLocation = function (req, res, next) {
  var coords = [req.body.lng, req.body.lat];
  var zipcode = fetchZipcode(coords);

  if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {

    // store new coordenates
    User.findOne({ '_id': req.params.user_id }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {

        user.loc = coords; // set new coordinates
        user.loc_attr.zipcode = zipcode; // update zipcode

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
/* PUT /api/users/:user_id/location */
exports.getNearbyUsers = function (req, res, next) {
  if (!req.params.user_id.match(USER_ID_PATTERN)) {
    res.status(400).json({
      message: ERROR[1]
    });
  } else {

    var coords = [req.body.lng, req.body.lat];
    var zipcode = fetchZipcode(coords);

    // store new coordinates
    User.findOne({ '_id': req.params.user_id }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[0]
        });
      } else if (user) {

        user.loc = coords;
        user.loc_attr.zipcode = zipcode;

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

        // inactivity max time limit value (in hours);
        //var inactiveTimeLimit = 5;

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
              '_id': {
                '$nin': user.blocked_users
              },
            //  'updatedAt': {
           //     '$gte': new Date(new Date().setHours(new Date().getHours() - inactiveTimeLimit)),
          //      '$lte': new Date()
         //     },
              'loc_attr.zipcode': zipcode
            }
          },
          {
            '$project': {
              '_id': 1,
              'updatedAt': 1,
              'active': 1,
              'username': 1,
              'loc': 1,
              'profile': 1
            }
          }
        ], function (err, users) {
          if (err) { return next(err); }

          // this removes the current user from the results array
          users.forEach(function (elem, index) {
            if (elem._id == req.params.user_id) {
              users.splice(index, 1);
            }
          });

          // modifies location properties and was_active string
          for (var key in users) {
            users[key].loc = {
              lng: users[key].loc[0],
              lat: users[key].loc[1]
            };
          }

          res.status(200).json(users);
        });
      }
    });
  }
};

// NOTE upload image to cloudinary from the client
/* PUT /api/users/:username/profile */
exports.updateUserProfile = function (req, res, next) {

  var NEW_PROFILE_INFO = req.body;

  User.findOne({ 'username': req.params.username }, function (err, user) {

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


exports.blockUser = function (req, res, next) {
  if (!req.params.user_id.match(USER_ID_PATTERN)) {
    res.status(400).json({
      message: ERROR[1]
    });
  } else {

    var BLOCKED_USER_ID = req.query.blocked_user;

    User.findOne({ '_id': req.params.user_id }, function (err, user) {
      if (err) { return next(err); }

      if (!user) {
        res.status(404).send({
          message: ERROR[0]
        });
      } else if (user) {

        if (user.blocked_users.indexOf(BLOCKED_USER_ID) > -1) {
          res.status(200).json({
            message: INFO[5]
          });
        } else {
          user.blocked_users.push(BLOCKED_USER_ID);

          user.save(function (err) {
            if (err) { return next(err); }
          });

          res.status(200).json({
            message: INFO[4]
          });
        }
      }
    });
  }
};

exports.removeBlockedUsers = function (req, res, next) {
  if (!req.params.user_id.match(USER_ID_PATTERN)) {
    res.status(400).json({
      message: ERROR[1]
    });
  } else {
    var BLOCKED_USERS = JSON.parse(req.query.blocked_users);

    User.findOne({ '_id': req.params.user_id }, function (err, user) {
      if (err) { return next(err); }

      if (!user) {
        res.status(404).send({
          message: ERROR[0]
        });
      } else if (user) {
        user.blocked_users.forEach(function (addedBlockedUsers) {
          BLOCKED_USERS.forEach(function (toRemove) {
            if (addedBlockedUsers == toRemove) {
              user.blocked_users.splice(addedBlockedUsers, 1);
            }
          });
        });

        user.save(function (err) {
          if (err) { return next(err); }
        });

        res.status(200).json({
          message: INFO[6]
        });
      }
    });
  }
};
