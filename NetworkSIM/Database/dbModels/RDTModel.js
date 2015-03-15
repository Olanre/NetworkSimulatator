var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RDTSchema = mongoose.Schema({
	
	name : String,
	version : String,
	description : String,
	main : String    
	
	});

//static methods
RDTSchema.statics.getRDTByName = function (aName, callback)
{
	this.findOne( {name : aName}, function(err, obj)
	{
		if(err) console.log("no RDT with name: " + aName );
		console.log("found RDT " + obj);
		callback(obj);
	});
}

module.exports = mongoose.model('RDT', RDTSchema, 'RDTs');