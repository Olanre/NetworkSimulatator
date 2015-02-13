/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/

var NetworkManager=require("./NetworkManager");
var DeviceManager=require("./DeviceManager");
var tokenManager = require("./TokenManager.js");
var TokenPropagator = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var deviceState = require("./deviceState.js");
var SimulationState = require("./simulationState.js");
var simulation = require("./Simulation.js");
var applicationState = require("./applicationState.js");
var TotalAppState = require("./TotalAppState.js");

var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;



exports.ClientRequest = function(token, eventQueue, callback) {
	
	//console.log(eventQueue);
	
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].URL) {
			case '/add/Simulation':  // should this be create/Simulation ?
				addSimulation(eventQueue[i].Body);
				break;
			
			case '/update/LocalCount':
				console.log('In LocalCount');
				updateLocalCount(token, eventQueue[i].Body);
		
				break;
		
			case '/authenticate/authToken':
				return authToken(token);
				
				break;
			
			
			case 'Partition':
				break;
			
			
			default:
				break;
				
		}	
	}
	callback();
};

exports.startState = function(callback) {
	
	//entire encapsulated application state
	var appstate = {};
	appstate.user = deviceState.getDeviceState();
	///console.log(appstate.user);
	appstate.current_simulation_session = SimulationState.getSimulationState();
	Database.getApp(function(data){
		//console.log(data);
		if(data !== null){
			
			for(var i = 0; i < data.simulation_list.length; i++){
				data.simulation_list[i] = JSON.parse(data.simulation_list[i]);
			}
			appstate.application = data;
			callback(appstate);
		}
	});
};



function authToken(token, callback){
		
	//var token = body.token; 
	tokenManager.authenticateToken(token, function(obj){
		//console.log(obj);
		callback(obj);
	});
		
}

function addSimulation(body) {
	var Device = deviceState.getDeviceState();
	var map = body.config_map;
	var d = new Date();
	var device_list = simulation.getDevices(map);
	//console.log(device_list);
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
	//console.log(body.config_map);
	//body.config_map = replaceAll('\"', "'", body.config_map);
	
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

function addDevice(body) {

	var device_name = body.device_name;
	var network_name = body.netowrk_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	//NetworkManager.addDevice(parameters);  // do you mean DeviceManager.addDevice(devID) ?
	
	router.post('/', function(req, res) {
		
		var request = new XMLHttpRequest();
		request.open('POST', '/add/Device');
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		
		//res.json(JSON.stringify());
	});
}


function createNetwork(networkObject){
	var simName=networkObject.networkName;
	var partitionName=networkObject.Partition_name;
	Database.createNetwork(simName, partitionName, networkObject);
}

function addPartition(partitionObject){
	var partitionName=partitionObject.PartitionName;
	var simulationName=partitionObject.simulation_name;
	Database.addPartition(simulationName,partitionName,partitionObject);
}

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
						appstate.user = Device;
					}else{
						var appstate = {};
						appstate.user = deviceState.getDeviceState();
						///console.log(appstate.user);
						appstate.current_simulation_session = SimulationState.getSimulationState();
						appstate.application = applicationState.getApplicationState();
					}
					callback(appstate);
				});
			 }); 
		 }else{
			 var appstate = {};
				appstate.user = deviceState.getDeviceState();
				///console.log(appstate.user);
				appstate.current_simulation_session = SimulationState.getSimulationState();
				appstate.application = applicationState.getApplicationState();
		 }
	 });
	var Local_Simulation = SimulationState.getSimulationState();
	var Application = applicationState.getApplicationState();
	var TotalState = TotalAppState.getTotalState();
	
	
	
}
function deleteDevice(deviceObject){
	var simulationName=deviceObject.simulation_name;
	var deviceName=deviceObject.device_name;
	Database.deleteDevice(simulationName,deviceName);
}

function deleteNetwork(networkObject){
	var networkName=networkObject.networkname;
	var simulationName=networkObject.simulation_name;
	Database.deleteNetwork(simulationName,networkName);
}

function removeToken(tokenObject){
	Database.removeToken(tokenObject);
}



function deletePartitionMap(partitionMapObject){
	var token = partitionMapObject.token;
	var simname=partitionMapObject.simulation_name;
	var partitionName=partitionMapObject.partition_name;
	Database.deletePartitionMap(simname,partitionName,token);
}

function deleteSimulation(simulationObject){
	var name=simulationObject.simulation_name;
	Database.deleteSimulation(name);
}

function updateAllCounts(userObject){
	var token=userObject.token;
	var localCount=userObject.localCount;
	Database.updateUserLocalCount(token,localCount);
	Database.updateUserGlobalCount(token,globalCount);
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
	var newName=networkObject.newName;
	var oldName=networkObject.oldName;
	Database.updateNetworkName(oldName,newName);
}

function updateDeviceName(deviceObject){
	var newName=deviceObject.newName;
	var oldName=deviceObject.oldName;
	Database.updateDeviceName(oldName,newName);
}

function updateSimulationName(simulationObject){
	var newName=simulationObject.newName;
	var oldName=simulationObject.oldName;
	Database.updateSimulationName(oldName,newName);
}

function updateTokenMethod(simulationObject){
	var simulationName=simulationObject.simulation_name;
	var newMethod=simulationObject.newmethod;
	Database.updateTokenMethod(simulationName,newMethod);
}

function updateDeviceNumber(deviceObject){
	var number=deviceObject.device_number;
	var simulation=deviceObject.simulation_name;
	Database.updateDeviceNumber(simulation,number);
}

function updateNetworkNumber(networkObject){
	var number=networkObject.network_number;
	var simulation=networkObject.simulation_name;
	Database.updateNetworkNumber(simulation,number);
}

function updatePartitionMap(partitionObject){
	var simulationName=partitionObject.simulation_name;
	var configMap=partitionObject.config_map;
	var partitionName=partitionObject.PartitionName;
	Database.updatePartitionMap(simulationName,partitionName,configmap);
}

function addDevice(body) {

	var device_name = body.device_name;
	var network_name = body.network_name;
	var partition_name = body.partition_name;
	var simulation_name = body.simuation_name;
	var token = body.token;
	//NetworkManager.addDevice(parameters);  // do you mean DeviceManager.addDevice(devID) ?
	
	router.post('/', function(req, res) {
		
		var request = new XMLHttpRequest();
		request.open('POST', '/add/Device');
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		
		//res.json(JSON.stringify());
	});
}



exports.authToken = authToken;
exports.storeSimulationInDatabase=function(simulation){	

};
module.exports.getNewState = getNewState;

