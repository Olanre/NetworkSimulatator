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
		appstate.device= Device.getTemplate();
		console.log(Device.getTemplate());
		appstate.current_simulation_session = Simulation.getTemplate();
		appstate.states = stateTemplate.getStateTemplate();
		appstate.application = App;
		console.log(appstate);
		callback(appstate);
	});
	
};


exports.getNewState = function(token, callback){
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
						callback(appstate);
					}else{
						callback(null);
					}
					
				});
			 }); 
		 }else{
			 callback(null);
					
		 }
	 });

	
}

function authToken(token, callback){
		
	TokenManager.authenticateToken(token, function(obj){
		console.log(obj);
		callback(obj);
	});
		
}

function createSimulation(body) {
	var device = Device.getTemplate();
	var map = body.config_map;
	var d = new Date();
	
	var simulation = new Simulation.createNewSimulation(body.simulation_name);
	var partition, network,device;
	simulation.simulationJSON=body;
	
	for(partitionName in map){
		
		partition=Partition.createNewPartition(partitionName,simulation.simulation_name);
		partition.partitionJSON.partition_name = partitionName;
		
		//simulation.partition_list.push(partitionJSON);
		
		for(networkName in map[partitionName]){
			
			network=Network.createNewNetwork(networkName,'WiFI');
			
			network.partitionObject=partition;
			network.networkJSON.partition=partition.partition_name;
			
			for(deviceName in map[partitionName][networkName]){
				var token=TokenManager.generateToken();
				//console.log(token);
				device=Device.createNewDevice(deviceName,token);
				
				device.networkObject=network;
				device.deviceJSON.email = deviceName;
				device.deviceJSON.registeredOn = d.toString();
				network.device_list.push(device);
				network.networkJSON.device_list.push(device.deviceJSON);
				
				console.log(device.deviceJSON);
				Database.getUserByToken('377d0cf326f287b1a9b9aeccc5fa02d25c85416f', function(User){
					User.email = "Heloo@mun.ca";
					Database.modifyUser(token,User);
				});
				
				break;
			}
			partition.network_list.push(network);
			partition.partitionJSON.network_list.push(network.networkJSON);
			break;
			//console.log(network.networkJSON);
			//Database.modifyNetworkByName(network.network_name,network.networkJSON);
		}
		simulation.partition_list.push(partition);
		//simulation.simulationJSON.partition_list.push(partition.partitionJSON);
		//console.log(partition.partitionJSON.network_list.);
		//Database.modifyPartitionByName(partition.partition_name,partition.partitionJSON);
		break;
	}
	//Database.modifySimByName(simulation.simulation_name,simulation.simulationJSON);
	
	//Dunno what this is about, so I'll leave it here for now
	Database.getApp(function(data){
		
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
	simulationList.push(simulation);
}	


//I didn't worry about this, we don't need it yet
function createDevice(body, simulationName) {
	var Sim = '';
	for(var i = 0; i < simulationList.length; i ++){
		if(simulationList[i].simulation_name == simulation){
			Sim = simulationList[i].simulation_name;
		}
	}
	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	//var token = body.token;
	admin.addDevice(device_name);  // do you mean DeviceManager.addDevice(devID) ?
	
	
}

function createNetwork(networkObject, simulation){
	var networkName = networkObject.networkName;
	var partitionName=networkObject.partition_name;
	admin.addNetwork(networkName, partitionName,  'Wifi', simulation);

		
};
function addPartition(partitionObject, simulation){
	var partitionName=partitionObject.partition_name;
	var simulationName=partitionObject.simulation_name;
	var simulationObject=Util.findSimulationByName(simulationList,simulationName);
	simulationObject.addPartition(partitionName);
	Database.modifySimByName(simulationName,simulationObject.simulationJSON);
}

//TODO
function deleteDevice(deviceObject, simulation){
	var simulationName=deviceObject.simulation_name;
	var deviceName=deviceObject.device_name;
	var networkName = deviceObject.network_name;
	var partitionName = deviceObject.partition_name; 
	var simulationObject=Util.findSimulationByName(simulationList,simulationName);l
	Database.modifySimByName(simulationName,simulationObject.simulationJSON);
	//Database.deleteDevice(simulationName,deviceName);
}
//TODO
function deleteNetwork(networkObject, simulation){
	var networkName=networkObject.network_name;
	var simulationName=networkObject.simulation_name;
	//Database.deleteNetwork(simulationName,networkName);
}
//TODO
function removeToken(tokenObject){
	//Database.removeToken(tokenObject);
}
//TODO
function deleteSimulation(simulationObject, simulation){
	var name=simulationObject.simulation_name;
	//Database.deleteSimulation(name);
}
//TODO
function updateAllCounts(userObject){
	var token=userObject.token;
	var localCount=userObject.localCount;
	Database.updateUserLocalCount(token,localCount);
	//Database.updateUserGlobalCount(token,globalCount);
}

var incr = 0;
//TODO
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
//TODO
function updateNetworkName(networkObject, simulation){
	var newName=networkObject.new_name;
	var oldName=networkObject.old_name;
	//Database.updateNetworkName(oldName,newName);
}
//TODO
function updateDeviceName(deviceObject, simulation){
	var newName=deviceObject.new_name;
	var oldName=deviceObject.old_name;
	//Database.updateDeviceName(oldName,newName);
}
//TODO
function updateSimulationName(simulationObject, simulation){
	var newName=simulationObject.new_name;
	var oldName=simulationObject.old_name;
	//Database.updateSimulationName(oldName,newName);
}
//TODO
function updateTokenMethod(simulationObject, simulation){
	var simulationName=simulationObject.simulation_name;
	var newMethod=simulationObject.new_method;
	//Database.updateTokenMethod(simulationName,newMethod);
}
//TODO
function updateDeviceNumber(deviceObject, simulation){
	var number=deviceObject.device_number;
	var simulation=deviceObject.simulation_name;
	//Database.updateDeviceNumber(simulation,number);
}
//TODO
function updateNetworkNumber(networkObject, simulation){
	var number=networkObject.network_number;
	var simulation=networkObject.simulation_name;
	//Database.updateNetworkNumber(simulation,number);
}
//TODO
function createDevice(body, simulation) {

	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	admin.addDevice(device_name,simulation_name);
	
}

/*
 * 1. Find the simulation object
 * 2. Find the network object
 * 3. Find the device object
 * 4. Connect the device object to the network object
 * 5. Update the simulation's config map (is this cheating? lol)
 * 6. Save the simulation in the database.
 */
function AddDevice2Network(body, simulation){
	var simulation_name = body.simulation_name;
	var device_name = body.device_name;
	var partition_name  = body.partition_name;
	var network_name = body.network_name;
	
	var networks=simulation.getNetworks();
	var devices=simulation.getDevices();
	
	var simulation=Util.findSimulationByName(simulationList,simulation_name);
	var network=Util.findNetworkByName(networks,network_name);
	var device=Util.findDeviceByName(devices,device_name);

	network.addDevice(device);
	
	simulation.simulationJSON.config_map=body.config_map;
	Database.modifySimbyName(simulation.simulation_name,simulation.simulationJSON);
	


}

function mergePartitions(body, simulation){
	var partition_a = body.partition_a;
	var partition_b = body.partition_b;
	var simulation_name = body.simulation_name;
	var config_map=body.config_map;
	var partitionA, partitionB;
	
	var simulation=Util.findSimulationByName(simulation_name,simulationList);
	var partitionA=Util.findPartitionByName(partition_a,simulation.partition_list);
	var partitionB=Util.findPartitionByName(partition_b,simulation.partition_list);
	partitionA.mergePartitions(partitionB);
	simulation.removePartition(partitionB);
	simulation.simulationJSON.config_map=body.config_map;
	Database.modifySimByName(simulation_name,simulation.simulationJSON);
}

function dividePartition(body, simulation){
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var networkName = body.network;
	
	var simulation=Util.findSimulationByName(simulation_name,simulationList);
	var partition=Util.findPartitionByName(partition_name,simulation.partition_list);
	var network=Util.findNetworkByName(networkName,partition.network_list);
	
	partition.dividePartition(network);
	simulation.simulationJSON.config_map=body.config_map;
	Database.modifySimByName(simulation_name,simulation.simulationJSON);
	
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
