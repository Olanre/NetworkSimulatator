var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appStateSchema = mongoose.Schema({	
	simulation : Sim,
	device : device,
	simulation_names: [String],
});

var appState = mongoose.model('appState', appStateSchema, 'newappStateFormat');