var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var networkSchema = mongoose.Schema({
	
	 network_name : String,
	 network_type : String,
	 device_list : [User],

	});


