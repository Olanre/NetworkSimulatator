//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;
//reference User model here
var Network = require("./networkModel").Network;
//defines the schema
//console.log(Network);


var partitionSchema = mongoose.Schema({
	 //type string
	 network_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'Network'}],
	 
	});

//Partition Methods


partitionSchema.statics.savePartition = function (aPartition)
{
	var newPartition = new Partition(aPartition);
	newPartition.save();
}

partitionSchema.statics.getPartitionByID = function (anID, callback)
{
	Partition.findOne({c}, function(err, obj)
	{
		if(err) console.log("No partition with name " + aName);
		//console.log("found partition" + obj);
		callback(obj);
	});
}


partitionSchema.statics.modifyPartitionByName = function (aString, aPartition)
{
   Partition.findOne({partition_name : aString}, function(err,obj)
   {
	   if(err) console.lgo("no Partition exists with that name");
	   obj = aPartition;
	   obj.save();
	   console.log("partition saved");
	   //callback();
   });
}

//exporting is done this way, defines, declares Network as the name of this schema/function model. 
module.exports = mongoose.model('Partition', partitionSchema, 'Partitions');