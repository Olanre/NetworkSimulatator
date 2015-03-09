//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;
//reference User model here

//defines the schema
var networkSchema = mongoose.Schema({
	 //type string
	 network_name : String,
	 //type string
	 network_type : String,
	 //array of type objectID's (every object has one) in reference to a User model. This object id will give you a User model.
	 device_list : [{type : Schema.Types.ObjectID, ref: 'User'}],
	 
	});


//These are all static functions

networkSchema.statics.saveNetwork = function (aNetwork)
{ 
	var newNetwork = new Network(aNetwork);
	newNetwork.save();
}

networkSchema.statics.getNetworkByName = function (aName, callback)
{
	Network.findOne( {network_name: aName}, function(err, obj)
	{
		if(err) console.log("no network with name: " + aName );
		
		console.log("found network" + obj);
		callback(obj);
	});
}

networkSchema.statics.modifyNetworkByName = function (aString, aNetwork)
{
	Network.findOne({network_name : aString}, function(err, obj)
	{
		if(err) console.log("No network with that name");
		obj = aNetwork;
	    obj.save();
		console.log("Network saved");
		//callback();
	});
}

//exporting is done this way, defines, declares Network as the name of this schema/function model. 
module.exports = mongoose.model('Network', networkSchema, networks);