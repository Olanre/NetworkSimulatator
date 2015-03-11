var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	
	token:String,
	email:String,
	verified: Boolean,
	current_partition: String,
	current_network: String,
	registeredOn: String,
	admin: Boolean,
	networks_created: [String],
	current_simulation: String,
	current_device_name: String,
	activity : String,
	
});

//Static Methods

userSchema.statics.addUser = function (aUser)
{ 
  var Lennete = new User(aUser);
  Lennete.save();
  console.log("saved user " + aUser);
}

userSchema.statics.modifyUser = function (aToken, aUser)
{
	  User.findOne({token: aToken}, function(err, obj)
	  {
	  if(err) console.log("No user with that token");
	  console.log("user saved");
	  obj= aUser;
	  obj.save();
	  console.log("User with token " + atoken + "edited " + example);	
	  });
}

module.exports = mongoose.model('User', userSchema, 'Users');