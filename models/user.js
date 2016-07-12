/**
 * @module
 * @moduledesc Defines the user model.
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('../lib/bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  active: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  loc: {
    type: [Number]
  },
  loc_attr: {
    zipcode: String
  },
  profile: {
    profile_image: String,
    gender: String,
    status: String
  },
  blocked_users: [{ type: Schema.Types.ObjectId }]
}, { timestamps: true });

userSchema.plugin(uniqueValidator); // validate unique schema properties

// Execute before each user.save() call
userSchema.pre('save', function (cb) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) { return cb(); }

  // Hash the changed password
  bcrypt.genSalt(5, function (err, salt) {
    if (err) { return cb(err); }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return cb(err); }
      user.password = hash;
      cb();
    });
  });
});

userSchema.methods.verifyPassword = function (candidatePwd, cb) {
  bcrypt.compare(candidatePwd, this.password, function (err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

userSchema.index({ loc: '2d' });

module.exports = mongoose.model('users', userSchema);

