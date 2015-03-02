//Needed
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Simulation_list Schema
var simulation_listSchema = mongoose.Schema({
     name : String,
	 num_devices : Number,
	 num_networks : Number,
});	
                      
//Complete										   
var Simulation_List = mongoose.model('Simulation_List', simulation_listSchema, 'newSim_ListFormat');
