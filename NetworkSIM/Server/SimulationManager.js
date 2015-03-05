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

module.exports.getSimulationNames=function(){
	var names_list=[];
	var new_entry = {};
	for(var index = 0; index < simulationList.length; index++){
		new_entry = {'num_devices': simulationList[index].simulationJSON.num_devices, 'num_networks': simulationList[index].simulationJSON.num_networks, 'simulation_name': simulationList[index].simulationJSON.simulation_name};
		names_list.push(new_entry);
	}
	
	return names_list;
	
}

module.exports.setSimulationNames=function(new_list){
	for(var i = 0; i <new_list.length; i++){
		simulationList[i] = JSON.parse(new_list[i]);
		
	}
	
}

function authToken(token, callback){
		
	TokenManager.authenticateToken(token, function(obj){
		//console.log(obj);
		callback(obj);
	});
		
}

function createSimulation(event_data) {

	var date = new Date();
	var map=event_data.config_map;
	var simulation=Simulation.createNewSimulation(event_data.simulation_name);
	simulation.simulationJSON.num_devices = event_data.num_devices;
	simulation.simulationJSON.num_networks = event_data.num_networks;
	var createdPartition,createdNetwork,createdDevice;
	for(partition in map){

		createdPartition=Partition.createNewPartition(partition,event_data.name);
		simulation.addPartition(createdPartition);
		
		for(network in map[partition]){

			createdNetwork=Network.createNewNetwork(network,"Wi-Fi",partition);
			createdPartition.addNetwork(createdNetwork);

			for(device in map[partition][network]){

					createdDevice=Device.createNewDevice(device, TokenManager.generateToken(),event_data.name, device);
					simulation.addDevice(createdDevice);
					createdNetwork.addDevice(createdDevice);
			}
		}
	}

	// Add database stuff
	simulationList.push(simulation);
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