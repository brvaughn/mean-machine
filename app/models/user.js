// Get the packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// define the schema
var UserSchema = new Schema({
      name : String,
      username : { type : String, required : true, index : { unique : true }},
      password : { type : String, required : true, select : false }
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  // hash only if the password has been changed or it's a new user
  if (!user.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    // change the password to the hashed
    user.password = hash;
    next();
  });

});

// method for comparing a given password to the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

// return the model
module.exports = mongoose.model('User', UserSchema);
