/**
 * New node file
 */
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var App_Spec = require("../Model/App_Spec.js");

function deployApp( event_data ){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	for(index in simulation.app_specs){
		if(simulation.app_specs[index].name = event_data.app_name){
			simulation.deployApp(simulation.app_specs[index]);
		}
	}
}

function launchApp( event_data){
	
}

function attachApp( location, simulation_id, spec){
	var time_stamp = new Date().toISOString();
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The App " +  spec.name +  " was imported into the simulation  at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		
		try{
			setTimeout(function(){
				var app = require(location + "/" + spec['main']);
				simulation.importApp(app);
				var new_spec = App_Spec.createNewApp_Spec( spec);
				simulation.attachAppSpec(new_spec);

			}, 1000);
			
		}
		catch(err){
			console.log(err);
		}
		//save the state
		
		SimulationManager.saveSimulationState( simulation._id, time_stamp, simulation);
	}
	
	
}

module.exports.attachApp = attachApp;