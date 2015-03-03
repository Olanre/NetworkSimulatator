/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var NetworkManager=require("./NetworkManager");
var DeviceManager=require("./DeviceManager");
var TokenManager = require("./TokenManager.js");
var TokenPropagator = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var Device = require("./Device.js");
var Partition = require("./Partition.js");
var Network = require("./Network.js");
var Simulation = require("./Simulation.js");
var admin = require("./admin.js");
var stateTemplate = require("./stateTemplate");
var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//TODO We need to fill this in on load!
var simulationList = [];


exports.ClientRequest = function(token, eventQueue, simulation, callback) {
	
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].URL) {
			case '/create/Simulation': 
				createSimulation(eventQueue[i].Body);
				break;
				 
			case '/add/Device/Network':
				AddDevice2Network( eventQueue[i].Body, simulation);
				break;
				
			case '/add/Device/FreeList':
				Add2FreeList(  eventQueue[i].Body, simulation);
				break;
				
			case '/create/Network' :
				createNetwork( eventQueue[i].Body, simulation);
				break;
				
			case '/create/Device' :
				createDevice(eventQueue[i].Body, simulation);
				break;
				
			case '/merge/Partitions' :
				mergePartitions(eventQueue[i].Body, simulation);
				break;
				
			case '/remove/Device' :
				removeDevice(eventQueue[i].Body, simulation);
				break;
				
			case '/remove/Device/FreeList' :
				removeDevicefromFreeList(eventQueue[i].Body, simulation);
				break;
				
			case '/delete/Device':
				deleteDevice(eventQueue[i].Body, simulation);
				break;
				
			case '/delete/Network' :
				deleteNetwork(eventQueue[i].Body, simulation);
				break;
				
			case '/delete/Token' :
				deleteToken(token, simulation);
				break;
				
			case '/delete/Partition':
				deletePartition(eventQueue[i].Body, simulation);
				break;
			
			case '/delete/Simulation' :
				deleteSimulation(eventQueue[i].Body);
				break;
			
			case '/update/LocalCount':
				console.log('In LocalCount');
				updateLocalCount(token, eventQueue[i].Body);
				break;	
			
			case '/update/NetworkName':
				updateNetworkName(eventQueue[i].Body, simulation);
				break;
			
			case '/update/DeviceName':
				updateDeviceName(eventQueue[i].Body, simulation);
				break;
			
			case '/update/SimulationName':
				updateSimulationName(eventQueue[i].Body, simulation);
				break;
			
			case '/update/TokenMethod':
				updateTokenMethod(eventQueue[i].Body, simulation);
				break;
				
			case '/update/DeviceNumber':
				updateDeviceNumber(eventQueue[i].Body, simulation);
				break;
			
			case '/update/NetworkNumber':
				updateNetworkNumber(eventQueue[i].Body, simulation);
				break;
				
			case '/update/ConfigMap':
				updateConfigMap(eventQueue[i].Body, simulation);
				break;
			
			case 'dividePartition':
				dividePartition(eventQueue[i].Body, simulation);
				break;
			default:
				break;
				
		}	
	}
	
	
	if (typeof(callback) == "function") {
		callback();
	}
};

/** 	-------------------------------------------
 * 				Getting and returning the states
 */
exports.startTemplate = function(callback) {
	
	//entire encapsulated application Template	
	Database.getApp( function(App){
		//blank name for now as identified by token
		//App.simulation_list = JSON.parse(App.simulation_list);
		for(var i = 0; i < App.simulation_list.length; i++){
			App.simulation_list[i] = JSON.parse(App.simulation_list[i]);
		}
		var appstate = {};
		
		appstate.device= {};
		appstate.simulation = {};
		appstate.simulation_names = App;
		//appstate.current_simulation_session = Simulation.getTemplate();
		//appstate.states = stateTemplate.getStateTemplate();
		
		callback(appstate);
	});
	
};


exports.getAppStateForDevice = function(token,simulation_name){

	var simulation,device,deviceList;

	simulation=Util.getSimulationByName(simulation_name,simulationList);
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

function createSimulation(body) {

	var device = Device.getTemplate();
	var d = new Date();
	var map=body.config_map;
	var simulation=Simulation.createNewSimulation(body.name);
	var createdPartition,createdNetwork,createdDevice;

	for(partition in map){

		createdPartition=Partition.createNewPartition(partition,body.name);
		simulation.addPartition(createdPartition);

		for(network in map[partition]){

			createdNetwork=Network.createNewNetwork(network,"Wi-Fi",partition);
			createdPartition.addNetwork(createdNetwork);

			for(device in map[partition][network]){

					createdDevice=Device.createNewDevice(device, TokenManager.generateToken(),body.name);
					createdNetwork.addDevice(createdDevice);

			}
		}
	}

	// Add database stuff


	setTimeout(function() {
		Database.getApp(function(data){
			
			if(data !== null){
				var Application = data;
				var item =  { 'name' : body.simulation_name, 'num_networks': body.num_networks, 'num_devices': body.num_devices};
				Application.total_devices += body.num_devices;
				Application.total_networks += body.num_networks;
				item = JSON.stringify(item);
				Application.simulation_list.push(item);
				Database.modifyApp(Application);
				Database.getSimByName(body.simulation_name, function(obj){
					obj.num_devices = body.num_devices;
					obj.num_networks = body.num_networks;
					obj.config_map = body.config_map;
					obj.tokenMethod = body.tokenMethod;
					Database.modifySimByName(body.simulation_name, obj);
					//console.log('');
					console.log("Done");
					simulationList.push(simulation);
					//callback();
				});
			}
		});
	//
		
	}, 3000 );
	
	return simulation;
}	


function createDevice(body) {

	var simulation=Util.getSimulationByName(body.simulation_name,simulationList);
	var device= Device.createNewDevice(body.device_name,tokenManager.generateToken());
	simulation.addDevice(device);

	//Add database calls
	return simulation;
}


function createNetwork(body){

	var simulation=Util.getSimulationByName(body.simulation_name,simulationList);
	var partition=Util.getPartitionByName(body.partition_name,simulation.partition_list);
	var network= Network.createNewNetwork(body.network_name);

	if(partition!=-1){
		partition.addNetwork(network);
	}
	else{
		simulation.addNetwork(network);
	}


};
//TODO
function addPartition(partitionObject, simulation){
	var partitionName=partitionObject.partition_name;
	var simulationName=partitionObject.simulation_name;
	//Database.addPartition(simulationName,partitionName,partitionObject);
}


function deleteDevice(deviceObject, simulation){
	var simulationName=deviceObject.simulation_name;
	var deviceName=deviceObject.device_name;
	var networkName = deviceObject.network_name;
	var partitionName = deviceObject.partition_name; 
	//Database.deleteDevice(simulationName,deviceName);
}

function deleteNetwork(networkObject, simulation){
	var networkName=networkObject.network_name;
	var simulationName=networkObject.simulation_name;
	//Database.deleteNetwork(simulationName,networkName);
}

function removeToken(tokenObject){
	//Database.removeToken(tokenObject);
}



function deletePartitionMap(partitionMapObject, simulation){
	var token = partitionMapObject.token;
	var simname=partitionMapObject.simulation_name;
	var partitionName=partitionMapObject.partition_name;
	//Database.deletePartitionMap(simname,partitionName,token);
}

function deleteSimulation(simulationObject, simulation){
	var name=simulationObject.simulation_name;
	//Database.deleteSimulation(name);
}

function deleteToken(token, simulation){
	//function delete user by token
}

function updateAllCounts(userObject){
	var token=userObject.token;
	var localCount=userObject.localCount;
	Database.updateUserLocalCount(token,localCount);
	//Database.updateUserGlobalCount(token,globalCount);
}

var incr = 0;

function updateLocalCount(token, body) {
	incr += 1;
	var localcount = body.localcount;
	var currentNetwork = body.current_network;
	var simulation_name = body.simulation_name;
	//console.log(token);
	Database.getUserByToken(token, function(User){
		User.localcount += incr;
		User.globalcount += incr;
		Database.modifyUser(token, User, function(){
			incr = 0;
		});
		
	});
	Database.getSimByName(simulation_name, function(Sim){
		Sim.globalcount += incr;
		Database.modifySimByName(simulation_name, Sim, function(){
			incr = 0;
		});
	});
}
function updateNetworkName(networkObject, simulation){
	var newName=networkObject.new_name;
	var oldName=networkObject.old_name;
	//Database.updateNetworkName(oldName,newName);
}

function updateDeviceName(deviceObject, simulation){
	var newName=deviceObject.new_name;
	var oldName=deviceObject.old_name;
	//Database.updateDeviceName(oldName,newName);
}

function updateSimulationName(simulationObject, simulation){
	var newName=simulationObject.new_name;
	var oldName=simulationObject.old_name;
	//Database.updateSimulationName(oldName,newName);
}

function updateTokenMethod(simulationObject, simulation){
	var simulationName=simulationObject.simulation_name;
	var newMethod=simulationObject.new_method;
	//Database.updateTokenMethod(simulationName,newMethod);
}

function updateDeviceNumber(deviceObject, simulation){
	var number=deviceObject.device_number;
	var simulation=deviceObject.simulation_name;
	//Database.updateDeviceNumber(simulation,number);
}

function updateNetworkNumber(networkObject, simulation){
	var number=networkObject.network_number;
	var simulation=networkObject.simulation_name;
	//Database.updateNetworkNumber(simulation,number);
}

function updatePartitionMap(partitionObject, simulation){
	var simulationName=partitionObject.simulation_name;
	var config_map=partitionObject.config_map;
	var partition_name=partitionObject.partition_name;
	//Database.updatePartitionMap(simulationName,partition_name,config_map);
}
//I don't think we need this yet?
function createDevice(body, simulation) {

	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	var Network = new topography.Network('hello');
	admin.addDevice = function(device_name){
	    //Device.
	  };
	
}


function AddDevice2Network( body, simulation){
	var simulation_name = body.simulation_name;
	var device_name = body.device_name;
	var partition_name  = body.partition_name;
	var network_name = body.network_name;
	
	var simulation,device,network;
	for(var index=0;index<simulationList;index++){
		if(simulationList[index].simulation_name==simulation_name)simulation=simulationList[index];
	}
	
	var networkList=simulation.getNetworks();
	for(var index=0;index<networkList;index++){
		if(networkList[index].networkName==simulation_name)network=networkList[index];
	}
	
	var deviceList=simulation.getDevices();
	for(var index=0;index<deviceList;index++){
		if(deviceList[index].device_name==simulation_name)device=deviceList[index];
	}
	
	network.addDevice(device);

}
//TODO
function mergePartitions(body, simulation){
	var partition_a = body.partition_a;
	var partition_b = body.partition_b;
	var simulation_name = body.simulation_name;
}
//TODO
function dividePartition(body, simulation){
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var network = body.network;
}

//TODO
function addDevice2FreeList(body, simulation){
	var simulation_name = body.simuation_name;
	var device_name = body.device_name;
}
//TODO
function removeDevicefromFreeList(body, simulation){
	var simulation_name = body.simuation_name;
	var device_name = body.device_name;
}
//TODO
function removeDevice(body, simulation){
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simulation_name;
	var device_name = body.device_name;
	
}


exports.authToken = authToken;
exports.storeSimulationInDatabase=function(simulation){	

};
//module.exports.getNewState = getNewState;
module.exports.simulationList=simulationList;
module.exports.createSimulation=createSimulation;