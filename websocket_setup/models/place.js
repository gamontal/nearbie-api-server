'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  place_name: String,
  place_location: {
    type: [Number]
  }
}, { timestamps: true });

placeSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('places', placeSchema);

