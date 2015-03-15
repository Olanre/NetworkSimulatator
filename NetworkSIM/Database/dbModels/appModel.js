var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({

	name : String,
	version : String,
	description : String,
	main : String,
	rdt_list : [String]	
	
	});

appSchema.statics.getAppByName = function (aName, callback)
{
	this.findOne( {name : aName}, function(err, obj)
	{
		if(err) console.log("no app with name: " + aName );
		console.log("found app" + obj);
		callback(obj);
	});
}

module.exports = mongoose.model('App', applicationSchema, 'Apps');