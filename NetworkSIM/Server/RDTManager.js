/**
 * New node file
 */
var fs=require('fs');
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var RDT_Spec = require("../Model/RDT_Spec.js");

function attachRDT( location, simulation_id, spec){
	var time_stamp = new Date().toISOString();
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The RDT " +  spec.name +  " was imported into the simulation at  " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		
		setTimeout(function(){
			//try{
					//require the rdt in our simulation
					var rdt = require(location + "/" + spec['main']);
					simulation.importRDT(rdt);
					 console.log("About to import");
					//attach the specs for the RDT into the simulation
					var new_spec = RDT_Spec.createNewRDT_Spec( spec);
					simulation.attachRDTSpec(new_spec);
					//console.log(simulation.simulationJSON);	
			
			//}
			//catch(err){
				//console.log(err);
			//}
		}, 2000);
		//save the state
		SimulationManager.saveSimulationState( simulation._id, time_stamp, simulation);
	}
	
}

function manipulateRDT(event_data, time_stamp){
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	var device_id = event_data.device_id;
	var 
}

module.exports.attachRDT = attachRDT;
