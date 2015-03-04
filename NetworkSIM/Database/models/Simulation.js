//Needed
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Simulation
var simulationSchema = mongoose.Schema({
	  // partion_list : [Partition],
	   //free_list : [User],
	   num_devices: Number,
	   num_networks: Number,
	   simulation_population: Number,
	   simulation_name: String,
	   //config map isn't used anymore
	   config_map: String,
	   tokenMethod : String,
	   //token_list : [tokens],
	   activity_logs : String,
	});


//Complete
var Sim = mongoose.model('Sim', simulationSchema, 'newSimFormat');