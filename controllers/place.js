'use strict';

const fetchZipcode = require('../lib/fetch_zipcode');

const Place = require('../models/place');
const User = require('../models/user');

const ERROR = [
  'Error: Invalid user ID',
  'Error: User doesn\'t exist',
  'Error: User validation failed',
  'Error: Place not found'
];

const USER_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

exports.getNearbyPlaces = function (req, res, next) {
  const USER_ID = req.params.user_id;

  if (!USER_ID.match(USER_ID_PATTERN)) {
    res.status(400).json({
      message: ERROR[0]
    });
  } else {

    const coords = [req.body.lng, req.body.lat];
    const zipcode = fetchZipcode(coords);

    // store new coordinates
    User.findOne({ '_id': USER_ID }, function (err, user) {

      if (err) { return next(err); }

      if (!user) {
        res.status(404).json({
          message: ERROR[1]
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
        let maxDistance = req.body.maxDistance || 2;

        // convert the distance to radius
        maxDistance /= 6371;

        // inactivity max time limit value (in hours);
        //var inactiveTimeLimit = 5;

        // query for nearby users
        Place.aggregate([
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
            //  'updatedAt': {
           //     '$gte': new Date(new Date().setHours(new Date().getHours() - inactiveTimeLimit)),
          //      '$lte': new Date()
         //     },
              'zipcode': zipcode
            }
          },
          {
            '$project': {
              '_id': 1,
              'createdAt': 1,
              'place_name': 1,
              'place_image': 1,
            }
          }
        ], function (err, places) {
          if (err) { return next(err); }

          res.status(200).json(places);
        });
      }
    });
  }
};

exports.getPlace = function (req, res, next) {
  const PLACE_ID = req.params.place_id;

  Place.findOne({ '_id': PLACE_ID }, { place_loc: 0, zipcode: 0 }, function (err, place) {
    if (err) { return next(err); }

    if (!place) {
      res.status(404).json({
        message: ERROR[3]
      });
    } else if (place) {
      res.status(200).json(place);
    }
  });
};

