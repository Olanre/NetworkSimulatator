/*****
The purpose of this class is to manage creating and modifying simulations.
@author Emily
******/
var mongoose = require("mongoose");
var TokenManager = require("./TokenManager.js");
var Util = require("../Utilities/utilities.js");
var TokenMailer = require("./TokenPropagatorEmail.js");
var Database = require("../Database/mongooseConnect.js");
var Models = require('../Database/dbModels/models.js');
var Device = require("../Model/Device.js");
var Partition = require("../Model/Partition.js");
var Network = require("../Model/Network.js");
var Simulation = require("../Model/Simulation.js");
var Simulation_History = require("../Model/Simulation_history.js");
var History_State = require("../Model/History_state.js");
var RDT = require("../Model/RDT_Spec.js");



var path = require('path');
var fs=require('fs');

var simulationList = [];
var simulationHistoryList = [];
Models.initialize();

exports.loadSimulations = function(simList){
	for (sim in simList){
		console.log("loading "+ simList[sim].simulation_name);
			
		simulationList.push(Simulation.loadSimulationFromJSON(simList[sim]));
	}
}
exports.populateLists = function(){
	for (sim in simulationList){

		simulationList[sim].network_list=simulationList[sim].getNetworks();
		simulationList[sim].device_list=simulationList[sim].getDevices();

		simulationList[sim].attachDeviceIterator(simulationList[sim].device_list);
		
		simulationList[sim].attachNetworkIterator(simulationList[sim].network_list);
		
		//import and replicate our rdts
		for(var index=0; index<simulationList[sim].simulationJSON.rdts.length;index++){
			RDT.loadRDTSpecFromDatabase(simulationList[sim].simulationJSON.rdts[index], function(createdRDT){
				simulationList[sim].rdt_specs.push(createdRDT);
				var location = "../rdts/" + createdRDT.specJSON.name + "/" + createdRDT.specJSON.main;
				var rdt = require(location);
				simulationList[sim].importRDT(rdt);
				
			});
			
		}
		
	}
}

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
	var newJSON=Util.deepCopy(simulation.simulationJSON);
	newJSON.rdts = buildListObject(newJSON.rdts, simulation.rdt_specs);
	newJSON.apps = buildListObject(newJSON.apps, simulation.app_specs);
	newJSON.partition_list=buildPartitionList(simulation);
	
	state.simulation=newJSON;
	
	device = Util.deepCopy(device.deviceJSON);
	device.apps = buildListObject( device.apps, simulation.app_specs);
	state.device=device;
	state.simulation_list=module.exports.getSimulationList();
	return state;
}
function buildPartitionList(simulation){
	var partition_list,network_list,device_list;
	partition_list=simulation.partition_list;
	var newNetworkList=[],newDeviceList=[],newPartitionList=[];

	for (pIndex in partition_list){

		network_list=partition_list[pIndex].network_list;

		for(nIndex in network_list){
			device_list=network_list[nIndex].device_list;

			for(dIndex in device_list){
				var device = Util.deepCopy(device_list[dIndex].deviceJSON);
				device.apps = buildListObject( device.apps, simulation.app_specs);
				newDeviceList.push(device);
			}
			var network=Util.deepCopy(network_list[nIndex].networkJSON);
			network.device_list=Util.deepCopy(newDeviceList);
			network.device_list=newDeviceList;
			newDeviceList=[];
			newNetworkList.push(network);
		}
		
		var partition=Util.deepCopy(partition_list[pIndex].partitionJSON);
		if(partition !== undefined){
			partition.network_list=Util.deepCopy(newNetworkList);
			partition.network_list=newNetworkList;
			newNetworkList=[];
			newPartitionList.push(partition);
		}
	}

	return newPartitionList;
}
function buildListObject(idList,objectList){
	var list=[];
	var item;
	if(idList !== undefined){
		for(id in idList){
			item=Util.findByUniqueID(idList[id],objectList);
			if(item != -1){
				list.push(item.specJSON);
			}
		}
	}
	return list;
}

exports.getAllActiveDevices = function(simulation_id){
	simulation=Util.findByUniqueID(simulation_id,simulationList);
	
	var List = [];
	if(simulation != -1){
		deviceList=simulation.getDevices();
	
		for(index in deviceList){
			//if(deviceList[index] !== undefined){
				if(deviceList[index].deviceJSON.verified == true){
					device=deviceList[index].deviceJSON;
					List.push(device);
				}
			//}
		}
	}
	

	return List;
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

module.exports.getSimulationHistory=function(simulation_id){
	var simulation_history = Util.findByUniqueID(simulation_id,simulationHistoryList);
	
	var history = simulation_history.simulation_historyJSON;

	if (history == -1){
		history = {};
	}
	return history;
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


function authToken(token, simulation_id,  callback){
	var res = {};
	//var state = getBlankAppState();
	res.Response = "Fail";
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	//simulation = simulationList[i];

	if(simulation != -1&&simulation!=undefined){
		var deviceList=simulation.device_list;
		for(var index = 0; index < deviceList.length; index++){

			if(deviceList[index].token == token){
				var timestamp = new Date().toISOString();
				res.Response = "Success";
				if(deviceList[index].deviceJSON.verified != true){
					var new_activity = "Device " +  deviceList[index].deviceJSON.current_device_name +  " was authenicated in the simulation at " + timestamp + "\n";
					simulation.updateSimulationLog(new_activity);
					deviceList[index].deviceJSON.verified = true;
					simulation.simulationJSON.simulation_population++;
					saveSimulationState( simulation_id, timestamp, simulation);
				}
				
				break;
			}
		}
	}
	
	callback(res);
		
}



function createSimulation(event_data, time_stamp) {

	var map=event_data.config_map;
	var simulation=Simulation.createNewSimulation(event_data.simulation_name);
	var simulation_history = Simulation_History.createNewSimulationHistory(simulation._id);	
	var new_activity = "Simulation " +  event_data.simulation_name + " created at " + time_stamp + "\n";
	//update simulation activity log
	simulation.updateSimulationLog(new_activity);
	
	
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
						createdDevice=Device.createNewDevice(device, token , simulation._id);
						createdDevice.deviceJSON.current_network = network;
						createdDevice.deviceJSON.current_partition = partition;
						createdDevice.deviceJSON.simulation_id = simulation._id;
						createdDevice.deviceJSON.registeredOn = time_stamp;
						
						simulation.addDevice(createdDevice);
						createdNetwork.addDevice(createdDevice);
						TokenMailer.mailToken(device,token,event_data.simulation_name);
						fs.writeFile(path.resolve(__dirname, 'tokens.txt'),token,function(err) {
					    if(err) {
					        console.log(err);
					    } else {
					        console.log("New tokens are saved in tokens.txt!");
					    }
					});
				}
			}
		}

	}
	simulation.simulationJSON.num_networks = event_data.num_networks;
	simulation.simulationJSON.num_devices = event_data.num_devices;
	//create a new history object
	simulationHistoryList.push(simulation_history);
	//save our state in the history object
	saveSimulationState( simulation._id, time_stamp, simulation);
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
		
		//save the state
		saveSimulationState( simulation._id, time_stamp, simulation);
	}
		
	//Add database calls
	return device;
}

function createNetwork(event_data, time_stamp){

	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var network= Network.createNewNetwork(event_data.network_name);
		var new_activity = "Network " +  event_data.network_name +  " was created  at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
	
		simulation.addNetwork(network);

		//save the state
		saveSimulationState( simulation._id, time_stamp, simulation);
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
	//save the state
	/** saveSimulationState( simulation._id, time_stamp, simulation);
	 * */


}

//TODO
function removeNetwork(event_data, time_stamp){
	//var simulation_name=event_data.simulation_name;
	//var network_id =event_data.network_id;
	
	//var simulation=Util.getByUniqueID(simulation_name,simulationList);
	//var network=Util.getByUniqueID(network_id,simulationObject.gets());
	//var new_activity = "Network " +  network.networkName +  " was deleted " + time_stamp + "\n";
	//simulation.updateSimulationLog(new_activity);
	
	//save the state
	/** //save the state
		saveSimulationState( simulation._id, time_stamp, simulation);
	*/
}

function addDeviceToNetwork(event_data, time_stamp){
	var time_stamp = new Date().toISOString();
	var network_id=event_data.network_id;
	var device_id=event_data.device_token;
	var simulation_id=event_data.simulation_id;

	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation != -1){
		var network=Util.findByUniqueID(network_id,simulation.getNetworks());
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			//don't add a device to a network they already belong to

			if(device.networkObject!=network){
	
				network.addDevice(device);
				var new_activity = "Device " +  device.device_name +  " added to network " + network.networkName + " at " + time_stamp + "\n";
				simulation.updateSimulationLog(new_activity, simulation);
				
				//save the state
				saveSimulationState( simulation_id, time_stamp, simulation);
			}
		}
	}


}

function mergePartitions(event_data, time_stamp){
	var partition_a = event_data.partition_a_id;
	var partition_b = event_data.partition_b_id;
	var simulation_id = event_data.simulation_id;

	var simulationObject=Util.findByUniqueID(simulation_id,simulationList);
	if(simulationObject != -1){

		
		var partitionA=Util.findByUniqueID(partition_a, simulationObject.partition_list);
		var partitionB=Util.findByUniqueID(partition_b, simulationObject.partition_list);

		var new_activity = "Two Partitions, " +  partitionA.partition_name +  " and "  + partitionB.partition_name + " were merged on " + time_stamp + "\n";
		simulationObject.updateSimulationLog(new_activity);
		console.log("merging partitions!");
		simulationObject.mergePartitions(partitionA,partitionB);
		//save the state
		saveSimulationState( simulation_id, time_stamp, simulationObject);
	}

	//Add database calls
}


function dividePartition(event_data, time_stamp){

	var network_list = event_data.split_networks_list;
	var partitionID = event_data.partition_id;
	var simulationID = event_data.simulation_id;
	var simulationObject = Util.findByUniqueID(simulationID, simulationList);
	var tempPartitionList =[];
	if(simulationObject!=-1){
		var partition = Util.findByUniqueID(partitionID, simulationObject.partition_list);
		console.log("dividing partitions!");

		for(var index =0; index<network_list.length;index++){

			var network=Util.findByUniqueID(network_list[index]._id,simulationObject.getNetworks());

			if(network!=-1){
				tempPartitionList.push(partition.removeNetwork(network));
			}
			for(var i=1;i<tempPartitionList.length;i++){
				simulationObject.mergePartitions(tempPartitionList[i],tempPartitionList[i-1]);
			}
			simulationObject.addPartition(tempPartitionList[tempPartitionList.length-1]);
		}
		saveSimulationState(simulationID,time_stamp,simulationObject);
	}
}

/** saves the state of the simulation for us
 * 
 * @param simulation_id,  the id of the simulation to be stored
 * @param time_stamp, the current timestamp the event recieved is
 * @param simulationObject, the simulation object
 */
function saveSimulationState( simulation_id, time_stamp, simulationObject){
	//save the state
	var simulation_history = Util.findByUniqueID(simulation_id,simulationHistoryList);
	if(simulation_history != -1 && simulation_history !== undefined){
		
		if(simulationObject.simulationJSON !== undefined && simulationObject.simulationJSON !== 'undefined'){
			var newJSON= Util.deepCopy(simulationObject.simulationJSON);
			newJSON.partition_list=buildPartitionList(simulationObject);
			
		}
		
		var history_state = History_State.createNewHistory_State(newJSON, time_stamp);
		simulation_history.addState(history_state.stateJSON);
	}
}

module.exports.saveSimulationState = saveSimulationState;
module.exports.authToken = authToken;
module.exports.simulationList=simulationList;
module.exports.createSimulation=createSimulation;
module.exports.addDeviceToNetwork = addDeviceToNetwork;
module.exports.createDevice = createDevice;
module.exports.createNetwork = createNetwork;
module.exports.removeNetwork = removeNetwork;
module.exports.mergePartitions = mergePartitions;
module.exports.dividePartition = dividePartition;
module.exports.buildPartitionList = buildPartitionList;
