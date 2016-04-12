'use strict';

var Place = require('../models/place');
var User = require('../models/user');

var ERROR = [
  'Error: Place not found'
];

exports.getNearbyPlaces = function (req, res, next) {
  Place.find({}, function (err, places) {
    if (err) { return next(err); }

    res.status(200).json(places);
  });
};

exports.getPlace = function (req, res, next) {
  var PLACE_ID = req.params.place_id;

  Place.findOne({ '_id': PLACE_ID }, { place_loc: 0, zipcode: 0 }, function (err, place) {
    if (err) { return next(err); }

    if (!place) {
      res.status(404).json({
        message: ERROR[0]
      });
    } else if (place) {
      res.status(200).json(place);
    }
  });
};

