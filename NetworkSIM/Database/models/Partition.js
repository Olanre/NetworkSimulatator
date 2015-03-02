var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Partition Schema
var partitionSchema = mongoose.Schema({
	partition_name: String,
	network_list: [Network],
});

var Partition = mongoose.model('Partition', partitionSchema, 'newPartitionFormat');