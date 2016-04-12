'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  place_name: String,
  place_loc: {
    type: [Number]
  }
}, { timestamps: true });

placeSchema.index({ place_loc: '2d' });

module.exports = mongoose.model('places', placeSchema);

