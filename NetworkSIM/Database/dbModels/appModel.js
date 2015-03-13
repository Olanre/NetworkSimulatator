var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({

	name : String,
	version : String,
	description : String,
	main : String,
	rdt_spec : [{name : String, version: String, description : String, main : String, rdt_list : String}]	
	
	});



module.exports = mongoose.model('App', applicationSchema, Apps);