var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({

	token:String,
	email:String,
	verified: Boolean,
	currentPartition: String,
	currentnetwork: String,
	registeredOn: String,
	is_admin: Boolean,
	networks_created: [networkSchema],
	application_id:String,
	localcount: Number,
	globalcount: Number,
	current_device_name: String,
	});