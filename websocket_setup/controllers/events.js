var mongoose = require('mongoose');
var Event = require('../models/event');
var socket = require('socket.io');
var geo = require('in-n-out');

exports.updateUserCount = function (req, res, next) {
  Event.find({}, function (err, events) {
    var geofences = [];

    events.forEach(function (elem, index) {
      geofences.push()
    });
  });
};
