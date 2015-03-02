//Needed
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
	networks_created: [],
	application_id:String,
	current_simulation: String,
	current_device_name: String,
	activity : String,
	});

//Complete                
var User = mongoose.model('User', userSchema, 'newUserFormat');