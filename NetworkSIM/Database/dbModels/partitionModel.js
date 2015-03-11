//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;
//reference User model here
var User = require("./networkModel").Network;
//defines the schema

var partitionSchema = mongoose.Schema({
	 //type string
	 id : String,
	 partition_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'Network'}],
	 
	});

//exporting is done this way, defines, declares Network as the name of this schema/function model. 
module.exports = mongoose.model('Partition', partitionSchema, 'Partitions');