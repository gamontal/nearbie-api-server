'use strict';

var Event = require('../models/event');
var User = require('../models/user');

var ERROR = [
  'Error: Event not found'
]

exports.getEvents = function (req, res, next) {
  Event.find({}, { 'event_name': 1, 'event_image': 1 }, function (err, events) {
    if (err) { return next(err); }

    res.status(200).json(events);
  });
};

exports.getEvent = function (req, res, next) {
  var EVENT_ID = req.params.eventid;

  Event.findOne({ '_id': EVENT_ID }, function (err, event) {
    if (err) { return next(err); }

    if (!event) {
      res.status(404).json({
        message: ERROR[0]
      });
    } else if (event) {

      var coords = event.event_loc;
      var zipcode = event.zipcode;

      // sets radius
      var maxDistance = req.query.maxDistance || 2;

      // convert the distance to radius
      maxDistance /= 6371;

      // query for nearby users
      User.aggregate([
        {
          '$geoNear': {
            'near': coords,
            'distanceField': 'calculated_distance',
            'maxDistance': maxDistance,
            'spherical': false
          }
        }
      ], function (err, result) {
        if (err) { return next(err); }

        event.user_count = result.length;
        event.save(function (err) {
          if (err) { return next(err); }

          event.zipcode = undefined;
          event.updatedAt = undefined;
          event.event_loc = undefined;

          res.status(200).json(event);
        });
      });
    }
  });
};
