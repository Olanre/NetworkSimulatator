var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//reference User model here


var networkSchema = mongoose.Schema({
	
	 network_name : String,
	 network_type : String,
	 device_list : [{type : Schema.Types.ObjectID, ref: 'User'}],
	 
	});

networkSchema.statics

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

networkSchema.statics.modifyNetowrkByName = function (aString, aNetwork)
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


module.exports = mongoose.model('Network', networkSchema, networks);