//requires mongoose node module
var mongoose = require('mongoose');

//requires schema
var Schema = mongoose.Schema;

//referencing the network model because partition has reference to network models
var Network = require("./networkModel").Network;

//partition objects will have an array-list of Network objects referenced by their ObjectId.
var partitionSchema = mongoose.Schema({
	 network_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'Network'}], 
	});

/*
 * Below are static functions that can be used by a partition model.
 */


//
partitionSchema.statics.savePartition = function (aPartition)
{
	var newPartition = new Partition(aPartition);
	newPartition.save();
}

partitionSchema.statics.getPartitionByID = function (anID, callback)
{
	Partition.findOne({_id : anID}, function(err, obj)
	{
		if(err) console.log("No partition with name " + aName);
		//console.log("found partition" + obj);
		callback(obj);
	});
}

//
partitionSchema.statics.modifyPartitionByName = function (aString, aPartition)
{
   Partition.findOne({partition_name : aString}, function(err,obj)
   {
	   if(err) console.log("no Partition exists with that name");
	   obj = aPartition;
	   obj.save();
	   console.log("partition saved");
   });
}

//export and define this mongoose model named "Partition", based off of "partitionSchema", and stored in collection "Partitions"
module.exports = mongoose.model('Partition', partitionSchema, 'Partitions');