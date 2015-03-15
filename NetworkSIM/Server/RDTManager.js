/**
 * New node file
 */
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
		
		
		try{
			setTimeout(function(){
				//require the rdt in our simulation
				var rdt = require(location + "/" + spec['main']);
				simulation.importRDT(rdt);
				
				//attach the specs for the RDT into the simulation
				var new_spec = RDT_Spec.createNewRDT_Spec( spec);
				simulation.attachRDTSpec(new_spec);
				//console.log(simulation.simulationJSON);

			}, 1000);
			
			
		}
		catch(err){
			console.log(err);
		}
		//save the state
		SimulationManager.saveSimulationState( simulation._id, time_stamp, simulation);
	}
	
}

module.exports.attachRDT = attachRDT;
