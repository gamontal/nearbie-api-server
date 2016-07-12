'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  event_name: String,
  event_image: String,
  start_day: Date,
  finish_day: Date,
  event_loc: {
    type: [Number]
  },
  zipcode: String,
  user_count: Number
}, { timestamps: true });

eventSchema.index({ loc: '2d' });

module.exports = mongoose.model('events', eventSchema);

