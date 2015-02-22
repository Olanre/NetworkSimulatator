/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var NetworkManager=require("./NetworkManager");
var DeviceManager=require("./DeviceManager");
var tokenManager = require("./TokenManager.js");
var TokenPropagator = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var deviceTemplate = require("./deviceTemplate.js");
var SimulationTemplate = require("./simulationTemplate.js");
var stateTemplate=require("./stateTemplate.js");
var simulation = require("./Simulation.js");
var topography = require("./network_topography");
var applicationTemplate = require("./applicationTemplate.js");
var TotalAppTemplate = require("./TotalAppTemplate.js");
var admin = require("./admin.js");

var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;





exports.ClientRequest = function(token, eventQueue, callback) {
	
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].URL) {
			case '/create/Simulation': 
				createSimulation(eventQueue[i].Body);
				break;
				 
			case '/add/Device/Network':
				AddDevice2Network( eventQueue[i].Body);
				break;
				
			case '/add/Device/FreeList':
				Add2FreeList(  eventQueue[i].Body);
				break;
				
			case '/create/Network' :
				createNetwork( eventQueue[i].Body);
				break;
				
			case '/create/Device' :
				createDevice(eventQueue[i].Body);
				break;
				
			case '/merge/Partitions' :
				mergePartitions(eventQueue[i].Body);
				break;
				
			case '/remove/Device' :
				removeDevice(eventQueue[i].Body);
				break;
				
			case '/remove/Device/FreeList' :
				removeDevicefromFreeList(eventQueue[i].Body);
				break;
				
			case '/delete/Device':
				deleteDevice(eventQueue[i].Body);
				break;
				
			case '/delete/Network' :
				deleteNetwork(eventQueue[i].Body);
				break;
				
			case '/delete/Token' :
				deleteToken(token);
				break;
				
			case '/delete/Partition':
				deletePartition(eventQueue[i].Body);
				break;
			
			case '/delete/Simulation' :
				deleteSimulation(eventQueue[i].Body);
				break;
			
			case '/update/LocalCount':
				console.log('In LocalCount');
				updateLocalCount(token, eventQueue[i].Body);
				break;	
			
			case '/update/NetworkName':
				updateNetworkName(eventQueue[i].Body);
				break;
			
			case '/update/DeviceName':
				updateDeviceName(eventQueue[i].Body);
				break;
			
			case '/update/SimulationName':
				updateSimulationName(eventQueue[i].Body);
				break;
			
			case '/update/TokenMethod':
				updateTokenMethod(eventQueue[i].Body);
				break;
				
			case '/update/DeviceNumber':
				updateDeviceNumber(eventQueue[i].Body);
				break;
			
			case '/update/NetworkNumber':
				updateNetworkNumber(eventQueue[i].Body);
				break;
				
			case '/update/ConfigMap':
				updateConfigMap(eventQueue[i].Body);
				break;
			
			case 'dividePartition':
				dividePartition(eventQueue[i].Body);
				break;
			default:
				break;
				
		}	
	}
	callback();
};

/** 	-------------------------------------------
 * 				Getting and returning the states
 */
exports.startTemplate = function(callback) {
	
	//entire encapsulated application Template
	var appstate = {};
	
	Database.getApp(function(App){

		appstate.device = deviceTemplate.getDeviceTemplate();
		///console.log(appstate.user);
		appstate.current_simulation_session = SimulationTemplate.getSimulationTemplate();
		appstate.states = stateTemplate.getStateTemplate();
		//App.simulation_list = JSON.parse(App.simulation_list);
		for(var i = 0; i < App.simulation_list.length; i++){
			App.simulation_list[i] = JSON.parse(App.simulation_list[i]);
		}
		appstate.application = App;
		callback(appstate);
	});
};

//callback horror!!
function getNewState(token, callback){
	var Device ;
	var Simulation;
	var Application;
	
	//console.log(token);
	 Database.getUserByToken(token, function(User){
		 Device = User;
		 //console.log(User);
		 if(User !== null){
			 var sim_name = Device.current_simulation;
			 Database.getSimByName(sim_name, function(Sim){
				 Simulation = Sim;
				Database.getApp(function(App){
					var appstate = {};
					//App.simulation_list = JSON.parse(App.simulation_list);
					for(var i = 0; i < App.simulation_list.length; i++){
						App.simulation_list[i] = JSON.parse(App.simulation_list[i]);
					}
					if(App !== null && Device !== null && Simulation !== null){
						Application = App;
						appstate.application = Application;
						Simulation.config_map = JSON.stringify(Simulation.config_map);
						Simulation.config_map = JSON.parse(Simulation.config_map);
						//console.log(Simulation.config_map);
						appstate.current_simulation_session = Simulation;
						appstate.device = Device;
					}else{
						var appstate = {};
						appstate.device = deviceTemplate.getDeviceTemplate();
						///console.log(appstate.user);
						appstate.current_simulation_session = SimulationTemplate.getSimulationTemplate();
						appstate.application = applicationTemplate.getApplicationTemplate();
					}
					callback(appstate);
				});
			 }); 
		 }else{
			 callback(null);
					
		 }
	 });

	
}

/** --------------------------------------------------
 * authorizing a token 
 */

function authToken(token, callback){
		
	//var token = body.token; 
	tokenManager.authenticateToken(token, function(obj){
		console.log(obj);
		callback(obj);
	});
		
}

function createSimulation(body) {
	var Device = deviceTemplate.getDeviceTemplate();
	var map = body.config_map;
	var d = new Date();
	var device_list = simulation.getDevices(map);
	for( var i = 0; i < device_list.length; i++) {
		
		Device.current_simulation = body.simulation_name;
		Device.registeredOn = d.toString();
		Device.current_device_name = device_list[i];
		Device.current_network = simulation.getNetwork(map, Device.name);
		Device.current_partition = simulation.getPartition(map, Device.current_network);
		Device.email = device_list[i];
		
		Device.token = DeviceManager.getToken();	
		TokenPropagator.mailToken(Device.email, Device.token, body.name);
		//console.log(Device);
		Database.addUser(Device);
	}
	
	body.config_map = JSON.stringify(body.config_map);
	
	Database.addSim(body);
	
	Database.getApp(function(data){
		//console.log(data);
		if(data !== null){
			var Application = data;
			var item =  { 'name' : body.simulation_name, 'num_networks': body.num_networks, 'num_devices': body.num_devices};
			Application.total_devices += body.num_devices;
			Application.total_networks += body.num_networks;
			item = JSON.stringify(item);
			Application.simulation_list.push(item);
			Database.modifyApp(Application);
		}
	});
	setTimeout(function() {
		Database.getSimByName(body.simulation_name, function(obj){
			//console.log('');
		});
	}, 800 );
	
	Device = {};
	Application = {};
	Simulation = {};
	
	
	
	//var AppState = TotalAppState.getTotalState();
	//console.log(body);
}	

function replaceAll(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
	}

function createDevice(body) {

	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	//NetworkManager.addDevice(parameters);  // do you mean DeviceManager.addDevice(devID) ?
	
	
}


function createNetwork(networkObject){
	var networkName = networkObject.networkName;
	var partitionName=networkObject.partition_name;
	admin.addNetwork(networkName, networkType){
		
		//
		
	}
	
	
	//Database.createNetwork(simName, partitionName, networkObject);
}

function addPartition(partitionObject){
	var partitionName=partitionObject.partition_name;
	var simulationName=partitionObject.simulation_name;
	//Database.addPartition(simulationName,partitionName,partitionObject);
}


function deleteDevice(deviceObject){
	var simulationName=deviceObject.simulation_name;
	var deviceName=deviceObject.device_name;
	//Database.deleteDevice(simulationName,deviceName);
}

function deleteNetwork(networkObject){
	var networkName=networkObject.network_name;
	var simulationName=networkObject.simulation_name;
	//Database.deleteNetwork(simulationName,networkName);
}

function removeToken(tokenObject){
	//Database.removeToken(tokenObject);
}



function deletePartitionMap(partitionMapObject){
	var token = partitionMapObject.token;
	var simname=partitionMapObject.simulation_name;
	var partitionName=partitionMapObject.partition_name;
	//Database.deletePartitionMap(simname,partitionName,token);
}

function deleteSimulation(simulationObject){
	var name=simulationObject.simulation_name;
	//Database.deleteSimulation(name);
}

function deleteToken(token){
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
function updateNetworkName(networkObject){
	var newName=networkObject.new_name;
	var oldName=networkObject.old_name;
	//Database.updateNetworkName(oldName,newName);
}

function updateDeviceName(deviceObject){
	var newName=deviceObject.new_name;
	var oldName=deviceObject.old_name;
	//Database.updateDeviceName(oldName,newName);
}

function updateSimulationName(simulationObject){
	var newName=simulationObject.new_name;
	var oldName=simulationObject.old_name;
	//Database.updateSimulationName(oldName,newName);
}

function updateTokenMethod(simulationObject){
	var simulationName=simulationObject.simulation_name;
	var newMethod=simulationObject.new_method;
	//Database.updateTokenMethod(simulationName,newMethod);
}

function updateDeviceNumber(deviceObject){
	var number=deviceObject.device_number;
	var simulation=deviceObject.simulation_name;
	//Database.updateDeviceNumber(simulation,number);
}

function updateNetworkNumber(networkObject){
	var number=networkObject.network_number;
	var simulation=networkObject.simulation_name;
	//Database.updateNetworkNumber(simulation,number);
}

function updatePartitionMap(partitionObject){
	var simulationName=partitionObject.simulation_name;
	var config_map=partitionObject.config_map;
	var partition_name=partitionObject.partition_name;
	//Database.updatePartitionMap(simulationName,partition_name,config_map);
}

function addDevice(body) {

	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	var Network = new topography.Network('hello');
	Network.addDevice = function(device_name){
	    //Device.
	  };
	
}

function AddDevice2Network( body){
	var simulation_name = body.simulation_name;
	var device_name = body.device_name;
	var partition_name  = body.partition_name;
	var network_name = body.network_name;
	Network.add
}

function mergePartitions(body){
	var partition_a = body.partition_a;
	var partition_b = body.partition_b;
	var simulation_name = body.simulation_name;
}

function dividePartition(body){
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var network = body.network;
}


function addDevice2FreeList(body){
	var simulation_name = body.simuation_name;
	var device_name = body.device_name;
}

function removeDevicefromFreeList(body){
	var simulation_name = body.simuation_name;
	var device_name = body.device_name;
}


exports.authToken = authToken;
exports.storeSimulationInDatabase=function(simulation){	

};
module.exports.getNewState = getNewState;

