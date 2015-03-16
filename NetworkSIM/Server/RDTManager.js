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
		SimulationManager.saveSimulationState( simulation_id, time_stamp, simulation);
	}
	
}

function manipulateRDT(event_data, time_stamp){
	
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	var device_id = event_data.device_id;
	var rdt_name = event_data.name;
	var rdt_method = event_data.method;
	var val = 'Not available';
	
	if(simulation !== null){
		var deviceList = simulation.getDevices();
		var device = Util.findByUniqueID(device_id,deviceList);
		if(device !== -1){
			var activity = " Device " + device.device_name + " manipulated the RDT " + rdt_name + " performing an " + rdt_method + " at " + time_stamp + "\n";
			device.updateDeviceLog(activity);
			simulation.updateSimulationLog(activity);
			//console.log(rdt_name + " RDTS " + device.rdts);
			var RDT = device.accessRDTByName(rdt_name);
			console.log(RDT);
			if(RDT !== null){
				RDT[rdt_method]();
				val =  RDT.val();
			}
		}else{
			console.log("Device was not found for manipulating the RDT");
		}
		SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		
	}
	
	return val;

}

module.exports.attachRDT = attachRDT;
module.exports.manipulateRDT = manipulateRDT;
