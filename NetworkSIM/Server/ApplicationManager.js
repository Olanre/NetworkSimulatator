/**
 * New node file
 */
var fs=require('fs');
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var App_Spec = require("../Model/App_Spec.js");

function deployApp( event_data ){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	for(index in simulation.app_specs){
		if(simulation.app_specs[index]._id == event_data.app_id){
			simulation.deployApp(simulation.app_specs[index]);
		}
	}
}

function launchApp( event_data){
	console.log("Request to launch app came in")
}

function attachApp( location, simulation_id, spec){
	var time_stamp = new Date().toISOString();
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The App " +  spec.name +  " was imported into the simulation  at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		setTimeout(function(){
			//try{
				var app = require(location + "/" + spec['main']);
				console.log("About to import");
				simulation.importApp(app);
				var new_spec = App_Spec.createNewApp_Spec( spec);
				simulation.attachAppSpec(new_spec);
			
			//}catch(err){
			//	console.log(err);
			//}
		}, 2000);
		//save the state
		
		SimulationManager.saveSimulationState( simulation._id, time_stamp, simulation);
	}
	
	
}

module.exports.attachApp = attachApp;
module.exports.deployApp = deployApp;