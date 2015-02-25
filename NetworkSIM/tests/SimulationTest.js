var Simulation=require("../simulation/Simulation.js");
var Database=require("../Database/mongooseConnect.js");
var Util=require("../simulation/utilities.js");

var blankSimulationJSON=Simulation.getTemplate();
console.log("This is what a blank simulation looks like in the database");
console.log(blankSimulationJSON);

console.log("Constructor test for the simulation class");
var newSimulation=new Simulation.createNewSimulation("test");
console.log(newSimulation.simulationJSON);

var session_data = {};
session_data.num_devices=3;
session_data.num_networks=4;
session_data.simulation_population = 0;
session_data.simulation_name ='thesilentroommate';
session_data.config_map = {};
session_data.tokenMethod = 0;
session_data.activity_logs = '';


Database.getSimByName('thesilentroommate',function(simJSON){
	console.log(simJSON);
	var sim=Simulation.loadSimulationFromJSON(simJSON);
});

console.log("some stuff");