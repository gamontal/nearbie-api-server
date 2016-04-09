'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  event_name: String,
  event_location: {
    type: [Number]
  }
}, { timestamps: true });

eventSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('events', eventSchema);

