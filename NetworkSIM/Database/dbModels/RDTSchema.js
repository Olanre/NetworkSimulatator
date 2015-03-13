var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RDTSchema = mongoose.Schema({
	
	name : String
	rdt_spec : { name : String, version : String, description : String, main : String}     
	
	});

module.exports = mongoose.model('RDT', RDTSchema);