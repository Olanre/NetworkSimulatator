/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var TokenManager = require("./TokenManager.js");
var Util = require("../Utilities/utilities.js");
var TokenMailer = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var Device = require("../Model/Device.js");
var Partition = require("../Model/Partition.js");
var Network = require("../Model/Network.js");
var Simulation = require("../Model/Simulation.js");
var Simulation_history = require("../Model/Simulation_history.js");
var History_state = require("../Model/History_state.js");
var path = require('path');
var fs=require('fs');

//TODO We need to fill this in on load!
var simulationList = [];

exports.getAppStateForDevice = function(token,simulation_id){

	var simulation,device,deviceList;

	simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation != -1){
		deviceList=simulation.getDevices();
	
		for(index in deviceList){
			if(deviceList[index]._id==token){
				device=deviceList[index];
				break;
			}
		}
	}

	var state = {};
	state.simulation=simulation.simulationJSON;
	state.device=device.deviceJSON;
	state.simulation_list=module.exports.getSimulationList();

	return state;
}

module.exports.getBlankAppState = function(){
	var state={};
	state.simulation= {};
	state.device= {};
	state.simulation_list= module.exports.getSimulationList();
	return state;
}

module.exports.getSimulationNames=function(){
	var names_list=[];
	for(index in simulationList){
		names_list.push(simulationList[index].simulationJSON.simulation_name);
	}
	return names_list;
}

module.exports.getSimulationList=function(){
	var names_list=[];
	var new_entry;
	for(index in simulationList){
		new_entry={};
		new_entry['num_devices'] = simulationList[index].simulationJSON.num_devices;
		new_entry['num_networks'] = simulationList[index].simulationJSON.num_networks;
		new_entry['simulation_name'] = simulationList[index].simulationJSON.simulation_name;
		new_entry['simulation_id'] = simulationList[index].simulationJSON._id;
		names_list.push(new_entry);
	}
	
	return names_list;
	
}

module.exports.setSimulationNames=function(new_list){
	for(var i = 0; i <new_list.length; i++){
		simulationList[i].simulationJSON.simulation_name = new_list[i];
		
	}
	
}

function authToken(token, simulation_id, callback){
	var res = {};
	//var state = getBlankAppState();
	res.Response = "Fail";
	for(i in simulationList){
		//simulation=Util.findByUniqueID(simulation_id,simulationList);
		simulation = simulationList[i];
		if(simulation != -1){
			deviceList=simulation.getDevices();
			//console.log(deviceList);
			for(var index = 0; index < deviceList.length; index++){
				if(deviceList[index].token == token){
					res.Response = "Success";
					var timestamp = new Date();
					var new_activity = "Device " +  deviceList[index].deviceJSON.current_device_name +  " was authenicated in the simulation at " + timestamp + "\n";
					simulation.updateSimulationLog(new_activity);
					deviceList[index].deviceJSON.verified = true;
					
					break;
				}
			}
		}
	}
	
	callback(res);
	//bypassing database for now.
	//TokenManager.authenticateToken(token, function(obj){
		//console.log(obj);
		//callback(obj);
	//});
		
}



function createSimulation(event_data, time_stamp) {

	var date = new Date();
	var map=event_data.config_map;
	var simulation=Simulation.createNewSimulation(event_data.simulation_name);
	var new_activity = "Simulation created " +  event_data.simulation_name + " at " + time_stamp + "\n";
	//update simulation activity log
	simulation.updateSimulationLog(new_activity);
	simulation.simulationJSON.num_devices = event_data.num_devices;
	simulation.simulationJSON.num_networks = event_data.num_networks;
	
	
	var createdPartition,createdNetwork,createdDevice;

	for(partition in map){

		if(partition=='freelist'){
			for(device in map[partition]){
				createdDevice=Device.createNewDevice(device, TokenManager.generateToken(),event_data.simulation_name, device);
				simulation.addDevice(createdDevice);
				TokenMailer.mailToken(device,createdDevice.token,event_data.simulation_name);
				
			}
		}

		else{
			createdPartition=Partition.createNewPartition(partition,event_data.partition_name);
			simulation.addPartition(createdPartition);
			for(network in map[partition]){
				createdNetwork=Network.createNewNetwork(network,"Wi-Fi",partition);
				createdPartition.addNetwork(createdNetwork);

				for(device in map[partition][network]){
						var token = TokenManager.generateToken();
						createdDevice=Device.createNewDevice(device, token ,event_data.simulation_name);
						createdDevice.deviceJSON.current_network = network;
						createdDevice.deviceJSON.current_partition = partition;
						createdDevice.deviceJSON.registeredOn = date.toString();
						
						simulation.addDevice(createdDevice);
						createdNetwork.addDevice(createdDevice);
						TokenMailer.mailToken(device,token,event_data.simulation_name);
						fs.writeFile(path.resolve(__dirname, 'tokens.txt'),token,function(err) {
					    if(err) {
					        console.log(err);
					    } else {
					       // console.log("The file was saved!");
					    }
					});
				}
			}
		}

	}

	// Add database stuff
	simulationList.push(simulation);
	return simulation;
}	


function createDevice(event_data, time_stamp) {
	
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var device= Device.createNewDevice(event_data.device_name,TokenManager.generateToken());
		var new_activity = "Device " +  event_data.device_name +  " was created at " + time_stamp + "\n";
		//add to activity log
		simulation.updateSimulationLog(new_activity);
		simulation.addDevice(device);
	}
		
	//Add database calls
	return device;
}

function createNetwork(event_data, time_stamp){

	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var partition=Util.findByUniqueID(event_data.partition_id,simulation.partition_list);
		var network= Network.createNewNetwork(event_data.network_name);
		var new_activity = "Network " +  event_data.network_name +  " was created  at " + time_stamp + "\n";
		simulaton.updateSimulationLog(new_activity);
	
		if(partition!=-1){
			partition.addNetwork(network,"Wi-Fi");
		}
		else{
			simulation.addNetwork(network);
		}
	}


};

//TODO
function removeDevice(event_data, time_stamp){
	//var simulation_name=event_data.simulation_name;
	//var device_id=event_data.device_id;
	
	//var simulation=Util.getByUniqueID(simulation_name,simulationList);
	//var device=Util.getByUniqueID(device_name,simulationObject.gets());
	//var new_activity = "Device " +  device.device_name +  " was deleted " + time_stamp + "\n";
	//simulation.updateSimulationLog(new_activity);


}

//TODO
function removeNetwork(event_data, time_stamp){
	//var simulation_name=event_data.simulation_name;
	//var network_id =event_data.network_id;
	
	//var simulation=Util.getByUniqueID(simulation_name,simulationList);
	//var network=Util.getByUniqueID(network_id,simulationObject.gets());
	//var new_activity = "Network " +  network.network_name +  " was deleted " + time_stamp + "\n";
	//simulation.updateSimulationLog(new_activity);
}

function addDeviceToNetwork(event_data, time_stamp){
	var network_id=event_data.network_id;
	var device_id=event_data.device_token;
	var simulation_id=event_data.simulation_id;

	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation != -1){
		var network=Util.findByUniqueID(network_id,simulation.getNetworks());
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			//don't add a device to a network they already belong to
			//console.log(device.deviceJSON);
			if(device.networkObject!=network){
				console.log('adding');
				network.addDevice(device);
				var new_activity = "Device " +  device.device_name +  " added to network " + network.network_name + " at " + time_stamp + "\n";
				simulation.updateSimulationLog(new_activity, simulation);
			}
		}
	}

}
//TODO untested
function mergePartitions(event_data, time_stamp){

	var partition_a = event_data.partition_a;
	var partition_b = event_data.partition_b;
	var simulation_id = event_data.simulation_id;

	var simulationObject=Util.findByUniqueID(simulation_id,simulationList);
	if(simulationObject != -1){
		var partitionA=Util.findByUniqueID(partition_a, simulationObject.partition_list);
		var partitionB=Util.findByUniqueID(partition_b, simulationObject.partition_list);
		var new_activity = "Two Partitions, " +  partitionA.partition_name +  " and "  + partitionB.partition_name + " were merged on " + timestamp + "\n";
		simulation.updateSimulationLog(new_activity);
		simulationObject.mergePartitions(partitionA,partitionB);
	}

	//Add database calls
}

//TODO
function dividePartitions(event_data, time_stamp){
	
}


module.exports.authToken = authToken;
module.exports.simulationList=simulationList;
module.exports.createSimulation=createSimulation;
module.exports.addDeviceToNetwork = addDeviceToNetwork;
module.exports.createDevice = createDevice;
module.exports.createNetwork = createNetwork;
module.exports.removeNetwork = removeNetwork;
module.exports.mergePartitions = mergePartitions;
module.exports.dividePartitions = dividePartitions;
