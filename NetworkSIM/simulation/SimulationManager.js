/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var TokenManager = require("./TokenManager.js");
var TokenPropagator = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var Device = require("./Device.js");
var Partition = require("./Partition.js");
var Network = require("./Network.js");
var Simulation = require("./Simulation.js");
var admin = require("./admin.js");
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//TODO We need to fill this in on load!
var simulationList = [];


exports.ClientRequest = function(token, eventQueue, callback) {
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].route) {

			//Completed
			case '/create/Simulation': 
				createSimulation(eventQueue[i].event_data);
				break;
			//Completed
			case '/create/Network' :
				createNetwork( eventQueue[i].event_data);
				break;		

			case '/create/Device' :
					createDevice(eventQueue[i].event_data);
				break;

			case '/move/Device/Network':
					addDeviceToNetwork(eventQueue[i].event_data);
				break;

			case '/merge/Partitions' :
				mergePartitions(eventQueue[i].event_data);
				break;
			
			case '/divide/Partition':
				dividePartition(eventQueue[i].event_data);
				break;

			default:
				break;
				
		}	
	}
	
	
	if (typeof(callback) == "function") {
		callback();
	}
};


exports.getAppStateForDevice = function(token,simulation_name){

	var simulation,device,deviceList;

	simulation=Util.getSimulationByName(simulation_name,simulationList);
	deviceList=simulation.gets();

	for(index in deviceList){
		if(deviceList[index].token==token){
			device=deviceList[index];
			break;
		}
	}

	var state;
	state.simulation=simulation.simulationJSON;
	state.device=device.deviceJSON;
	state.simulation_names=module.exports.getNames();

	return state;
}

module.exports.getNames=function(){
	var names_list=[];
	for(index in simulationList){
		names_list.push(simulationList[index].simulation_name);
	}
	return names_list;
}

function authToken(token, callback){
		
	TokenManager.authenticateToken(token, function(obj){
		console.log(obj);
		callback(obj);
	});
		
}

function createSimulation(event_data) {

	var date = new Date();
	var map=event_data.config_map;
	var simulation=Simulation.createNewSimulation(event_data.name);
	var createdPartition,createdNetwork,createdDevice;

	for(partition in map){

		createdPartition=Partition.createNewPartition(partition,event_data.name);
		simulation.addPartition(createdPartition);

		for(network in map[partition]){

			createdNetwork=Network.createNewNetwork(network,"Wi-Fi",partition);
			createdPartition.addNetwork(createdNetwork);

			for(device in map[partition][network]){

					createdDevice=Device.createNewDevice(device, TokenManager.generateToken(),event_data.name, device);
					createdSimulation.addDevice(createdDevice);
					createdNetwork.addDevice(createdDevice);
			}
		}
	}

	// Add database stuff
	
	return simulation;
}	


function createDevice(event_data) {

	var simulation=Util.getSimulationByName(event_data.simulation_name,simulationList);
	var device= Device.createNewDevice(event_data.device_name,tokenManager.generateToken());
	simulation.addDevice(device);

	//Add database calls
	return simulation;
}

function createNetwork(event_data){

	var simulation=Util.getSimulationByName(event_data.simulation_name,simulationList);
	var partition=Util.getPartitionByUniqueID(event_data.partition_name,simulation.partition_list);
	var network= Network.createNewNetwork(event_data.network_name);

	if(partition!=-1&&event_data.partition_name!=''){
		partition.addNetwork(network);
	}

	else{
		simulation.addNetwork(network);
	}


};

//TODO - Will we even need to remove a device? Leaving this until later.
function removeDevice(event_data){
	//var simulation_name=event_data.simulation_name;
	//var device_name=event_data.device_name;

	//var simulationObject=Util.getByUniqueID(simulation_name,simulationList);
	//var deviceObject=Util.getByUniqueID(device_name,simulationObject.gets());


}

//TODO - We definitely don't need to do this until later
function removeNetwork(event_data){
}

function addDeviceToNetwork(event_data){
	var network_name=event_data.network_name;
	var device_name=event_data.device_name;
	var simulation_name=event_data.simulation_name;

	var simulation=Util.getSimulationByName(simulation_name,simulationList);
	var network=Util.getNetworkByName(network_name,simulation.getNetworks());
	var device=Util.getDeviceByName(device_name,simulation.getDevices());

	network.addDevice(device);

}

function mergePartitions(event_data){
	var partition_a = event_data.partition_a;
	var partition_b = event_data.partition_b;
	var simulation_name = event_data.simulation_name;

	var simulationObject=Util.getSimulationByName(simulation_name,simulationList);
	var partitionA=Util.getPartitionByName(partition_a, simulationObject.partition_list);
	var partitioB=Util.getPartitionByName(partition_b, simulationObject.partition_list);
	simulationObject.mergePartitions(partitionA,partitionB);

	//Add database calls
}

//TODO
function dividePartitions(event_data){
	
}



function addDeviceToFreeList(event_data){
	var simulation_name=event_data.simulation_name;
	var device_name=event_data.device_name;

	var simulationObject=Util.getSimulationByName(simulation_name,simulationList);
	var deviceObject=Util.getDeviceByName(device_name,simulationObject.getDevices());
	var networkObject=deviceObject.networkObject;
	networkObject.removeDevice(deviceObject);
}
//TODO
function removeDevicefromFreeList(event_data, simulation){
	
}


module.exports.authToken = authToken;
module.exports.simulationList=simulationList;
module.exports.createSimulation=createSimulation;