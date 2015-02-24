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
var Simulation = require("./Simulation.js");
var admin = require("./admin.js");

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
	var appstate = {};
	
	Database.getApp(function(App){
		//blank name for now as identified by token
		var device = new Device("");
		appstate.device=device.getTemplate();
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
	
	var simulation = new Simulation.cerateNewSimulation(body.simulation_name);
	var partition, network,device;
	simulation.simulationJSON=body;
	
	for(partitionName in map){
		
		partition=Partition.createNewPartition(partitionName,simulation.simulation_name);
		simulation.JSON.partition_list.push(partitionJSON);
		simulation.partition_list.push(partitionJSON);
		
		for(networkName in map[partitionName]){
			
			network=Network.createNewNetwork(networkName,'WiFI');
			partition.network_list.push(network);
			network.partitionObject=partition;
			network.networkJSON.partition=partition.partition_name;
			
			for(deviceName in map[partitionName][networkName]){
				var token=TokenManager.generateToken();
				device=Device.createNewNetwork(deviceName,token);
				device.networkObject=network;
				network.device_list.push(device);
				network.networkJSON.device_list.push(device.deviceJSON);
				Database.modifyUser(token,device.deviceJSON);
			}
			Database.modifyNetworkByName(network.network_name,network.networkJSON);
		}
		Database.modifyPartitionByName(partition.partition_name,partition.partitionJSON);
	}
	Database.modifySimByName(simulation.simulation_name,simulation.simulationJSON);
	
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
