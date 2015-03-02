var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Application Schema
var applicationSchema = mongoose.Schema({
	simulation_list : [String],
	super_admin: String,
	total_devices : Number,
	total_networks : Number,
	});
	
//Complete
var App = mongoose.model('App', applicationSchema, 'newAppFormat');
