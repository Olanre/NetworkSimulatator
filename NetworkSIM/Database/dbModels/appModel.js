var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RDT = require("./rdtModel").RDT;

var applicationSchema = mongoose.Schema({

	name : String,
	version : String,
	description : String,
	main : String,
	rdt_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'RDT'}]	
	
	});



module.exports = mongoose.model('App', applicationSchema, Apps);