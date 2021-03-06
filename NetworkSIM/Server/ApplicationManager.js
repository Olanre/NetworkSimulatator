/**
 * New node file
 */
var fs=require('fs');
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var App_Spec = require("../Model/App_Spec.js");

function deployApp( event_data, time_stamp ){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var device_id= event_data.device_token;
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			for(index in simulation.app_specs){
				if(simulation.app_specs[index]._id == event_data.app_id){
					
					var new_activity = "The App " +  simulation.app_specs[index].specJSON.name +  " was deployed to device " + device.device_name  
					+ " at " + time_stamp + "\n";
					simulation.updateSimulationLog(new_activity);
					device.attachAppSpec(simulation.app_specs[index].specJSON);
				}
			}
			SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		}
	}
}

function reverse_deploymentApp( event_data, time_stamp ){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var device_id= event_data.device_token;
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			for(index in simulation.app_specs){
				if(simulation.app_specs[index]._id == event_data.app_id){
					
					var new_activity = "The App " +  simulation.app_specs[index].specJSON.name +  " was removed from device " + device.device_name  
					+ " at " + time_stamp + "\n";
					simulation.updateSimulationLog(new_activity);
					device.removeAppSpec(simulation.app_specs[index].specJSON);
				}
			}
			SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		}
	}
	
}

function launchApp( event_data, time_stamp){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation !== -1){
		for(index in simulation.app_specs){
			if(simulation.app_specs[index]._id == event_data.app_id){
				console.log("Request to launch app came in");
			}
		}
		
	}
	
}

function attachApp( location, simulation_id, spec, time_stamp){
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The App " +  spec.name +  " was imported into the simulation  at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		setTimeout(function(){
			//try{
				
				console.log("About to import");
				
				var new_spec = App_Spec.createNewApp_Spec( spec);
				simulation.attachAppSpec(new_spec);
				simulation.importApp(new_spec);
			
			//}catch(err){
			//	console.log(err);
			//}
		}, 2000);
		//save the state
		
		SimulationManager.saveSimulationState( simulation_id, time_stamp, simulation);
	}
	
	
}
module.exports.reverse_deploymentApp = reverse_deploymentApp;
module.exports.attachApp = attachApp;
module.exports.launchApp = launchApp;
module.exports.deployApp = deployApp;