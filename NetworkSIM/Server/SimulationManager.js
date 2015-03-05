/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var TokenManager = require("./TokenManager.js");
var TokenPropagator = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var Device = require("../Model/Device.js");
var Partition = require("../Model/Partition.js");
var Network = require("../Model/Network.js");
var Simulation = require("../Model/Simulation.js");
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//TODO We need to fill this in on load!
var simulationList = [];

exports.getAppStateForDevice = function(token,simulation_id){

	var simulation,device,deviceList;

	simulation=Util.findByUniqueID(simulation_id,simulationList);
	deviceList=simulation.getDevices();

	for(index in deviceList){
		if(deviceList[index].token==token){
			device=deviceList[index];
			break;
		}
	}

	var state;
	state.simulation=simulation.simulationJSON;
	state.device=device.deviceJSON;
	state.simulation_names=module.exports.getSimulationNames();

	return state;
}

module.exports.getSimulationNames=function(){
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

	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	var device= Device.createNewDevice(event_data.device_name,tokenManager.generateToken());
	simulation.addDevice(device);

	//Add database calls
	return simulation;
}

function createNetwork(event_data){

	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	var partition=Util.findByUniqueID(event_data.partition_id,simulation.partition_list);
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

}

//TODO - We definitely don't need to do this until later
function removeNetwork(event_data){
}


function addDeviceToNetwork(event_data){
	var network_id=event_data.network_id;
	var device_Id=event_data.device_id;
	var simulation_id=event_data.simulation_id;

	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	var network=Util.findByUniqueID(network_id,simulation.getNetworks());
	var device=Util.findByUniqueID(device_id,simulation.getDevices());

	network.addDevice(device);

}

function mergePartitions(event_data){
	var partition_a = event_data.partition_a;
	var partition_b = event_data.partition_b;
	var simulation_id = event_data.simulation_id;

	var simulationObject=Util.findByUniqueID(simulation_id,simulationList);
	var partitionA=Util.findByUniqueID(partition_a, simulationObject.partition_list);
	var partitioB=Util.findByUniqueID(partition_b, simulationObject.partition_list);
	simulationObject.mergePartitions(partitionA,partitionB);

	//Add database calls
}

//TODO
function dividePartitions(event_data){
	
}



function addDeviceToFreeList(event_data){
	var simulation_id=event_data.simulation_id;
	var device_id=event_data.device_id;

	var simulationObject=Util.findByUniqueID(simulation_id,simulationList);
	var deviceObject=Util.findByUniqueID(device_id,simulationObject.getDevices());
	var networkObject=deviceObject.networkObject;
	networkObject.removeDevice(deviceObject);
}
//TODO
function removeDevicefromFreeList(event_data, simulation){
	
}


module.exports.authToken = authToken;
module.exports.simulationList=simulationList;
module.exports.createSimulation=createSimulation;