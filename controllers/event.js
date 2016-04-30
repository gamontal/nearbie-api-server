'use strict';

const Event = require('../models/event');
const User = require('../models/user');

const ERROR = [
  'Error: Event not found'
]

exports.getEvents = function (req, res, next) {
  Event.find({}, { 'event_name': 1, 'event_image': 1 }, function (err, events) {
    if (err) { return next(err); }

    res.status(200).json(events);
  });
};

exports.getEvent = function (req, res, next) {
  const EVENT_ID = req.params.event_id;

  Event.findOne({ '_id': EVENT_ID }, function (err, event) {
    if (err) { return next(err); }

    if (!event) {
      res.status(404).json({
        message: ERROR[0]
      });
    } else if (event) {

      const coords = event.event_loc;
      const zipcode = event.zipcode;

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
