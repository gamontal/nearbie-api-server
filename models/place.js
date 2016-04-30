'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let placeSchema = new Schema({
  place_name: String,
  place_image: String,
  place_loc: {
    type: [Number]
  },
  zipcode: String
}, { timestamps: true });

placeSchema.index({ place_loc: '2d' });

module.exports = mongoose.model('places', placeSchema);

