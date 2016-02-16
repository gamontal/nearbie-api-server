var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, index: true, unique: true, required: true },
  profile: {
    profile_image: String,
    full_name: String,
    gender: String,
    interests: String
  }
});

userSchema.plugin(uniqueValidator); // validate unique properties

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

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('users', userSchema);

