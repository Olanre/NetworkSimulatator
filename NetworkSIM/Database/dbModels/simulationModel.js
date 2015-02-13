var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var simulationSchema = mongoose.Schema({

     name : String,
	 num_devices : Number,
	 num_networks : Number,
});