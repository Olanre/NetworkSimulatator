//Needed
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Simulation
var simulationSchema = mongoose.Schema({
	   partion_list : [Partition],
	   num_devices: Number,
	   num_networks: Number,
	   simulation_population: Number,
	   simulation_name: String,
	   tokenMethod : String,
	   activity_logs : String,
	});


//Complete
var Sim = mongoose.model('Sim', simulationSchema, 'newSimFormat');