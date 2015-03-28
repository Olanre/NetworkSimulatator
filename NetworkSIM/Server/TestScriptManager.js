/**
 * New node file
 */
var SimulationManager = require("./SimulationManager.js");
var RDTManager = require("./RDTManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");

var script_rdts;
var device_mobility;
var moves;
var operations;
var frequency;

var deviceList;
var networkList; 
var partitionList;

function init(simulation_id, spec, time_stamp){
	console.log(simulation_id);
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		//get devices and networks
		deviceList = simulation.device_list;
		networkList = simulation.network_list;
		partitionList = simulation.partition_list;
		var spec = JSON.parse(spec);
		
		//log the loading of the script
		var new_activity = "Test Script " + spec.name + " was loaded on the simulation at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		
		//gather the parameters from the script
		var parameters = spec.parameters;
		script_rdts = parameters.rdts;
		device_mobility = parameters.device_mobility;
		renderMoves();
		operations = parameters.operations;
		
		frequency = Math.floor(moves / operations);
		runScript(simulation);
		
	}
}

function runScript(simulation){
	var ran_network;
	var ran_device;
	var ran_partition;
	var ran_rdt;
	var counter = 0;
	//console.log(simulation);
	var partitionSplit = true;
	console.log("Device Moves is " + moves);
	while ( moves > 0 && operations > 0){
		counter++;
		ran_network = Util.randomElement( networkList );
		ran_device = Util.randomElement( deviceList );
		console.log(ran_network + " Random Device is " + ran_device);
		if(ran_network !== undefined && ran_device !== undefined && simulation !== undefined){
			
			var event_data = wrapDeviceMover( ran_device, ran_network, simulation);
			var time_stamp = new Date().toISOString();
			SimulationManager.addDeviceToNetwork(event_data, time_stamp);
			console.log("ran_device is " + ran_device.device_name + " ran_network is " + ran_network.networkName);
			
			if((counter % frequency) === 0){
				
				console.log("Counter is now " + counter + " Frequency is set at" + frequency);
				ran_rdt = Util.randomElement(script_rdts);
				event_data = wrapRDTManipulator(ran_device, ran_rdt, simulation)
				RDTManager.manipulateRDT(event_data, time_stamp);
				operations--;
				
				if(partitionSplit){
					
					var ran_partition1 = Util.randomElement(partitionList);
					var ran_partition2 = Util.randomElement(partitionList);
					if(ran_partition1 !== undefined && ran_partition2 !== undefined  ){
						
						if(ran_partition1 !== ran_partition2){
							
							event_data = wrapPartitionMerge(ran_partition1, ran_partition2, simulation);
							SimulationManager.mergePartitions(event_data, time_stamp);
						}
					}
					partitionSplit = false;
					
				}else{
					
					ran_partition = Util.randomElement(partitionList);
					if(ran_partition !== undefined ){
						
						if(ran_partition.network_list.length > 1){
							
							var ran_network = Util.randomElement( ran_partition.network_list );
							
							if(ran_network !== undefined){
								
								event_data = wrapPartitionDivider( ran_network, ran_partition, simulation);
								SimulationManager.dividePartition(event_data, time_stamp);
							}
						}
					}
					partitionSplit = true;
				}
				
			}
		}
		
		moves--;
		
		//if(counter > 500) break;
	}
	
	
}

function wrapDeviceMover( device, network, simulation){
	var event_data = {}
	event_data.network_id = network._id;
	event_data.device_token = device.token;
	event_data.simulation_id = simulation._id;
	return event_data;
	
}

function wrapRDTManipulator(device, rdt_element, simulation){
	var event_data = {};
	event_data.simulation_id = simulation._id;
	event_data.device_id = device.token;
	event_data.name = rdt_element.name;
	event_data.method = rdt_element.method;
	return event_data;
}

function wrapPartitionMerge(partitiona, partitionb, simulation){
	var event_data = {};
	event_data.partition_a_id = partitiona._id;
	event_data.partition_b_id = partitionb._id;
	event_data.simulation_id = simulation._id;
	return event_data;
}

function wrapPartitionDivider( network, partition, simulation){
	var event_data = {};
	event_data.split_networks_list = [ network];
	event_data.partition_id = partition._id;
	event_data.simulation_id = simulation._id;
	return event_data;
}

function generateReport(){

}


function renderMoves(){
	switch(device_mobility) {
	case 'high':
		moves = 40;
		break;
	case 'meduim':
		moves = 20;
		break;
	case 'low':
		moves = 10;
		break;
	default:
		break;
	
	}
}

module.exports.init = init;