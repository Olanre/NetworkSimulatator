var Util=require("./utilities.js");

function Device(deviceName,token, simulation_name , registeredOn, partition_name, current_network){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.networkObject={};
	this.networks_created = [];
	this.rdt = {};

	//This is tied to Andrew's database model, check it later//
	this.deviceJSON={};
	this.deviceJSON.current_device_name=deviceName;
	this.deviceJSON.token=token;
	this.deviceJSON.email = deviceName;
	this.deviceJSON.registeredOn = registeredOn;
	this.deviceJSON.current_simulation = simulation_name;
	this.deviceJSON.current_partition = partition_name;
	this.deviceJSON.current_network = current_network;
	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	
	//Our Functions//
	//this.joinSimulation=joinSimulation;
	this.attachJSON=attachJSON;
}


function createNewDevice(deviceName,token, simulation_name,email, registeredOn, partition_name, current_network){
	var createdDevice=new Device(deviceName,token, simulation_name ,email, registeredOn, partition_name, current_network);
	//wrapper class will be responsible for this
	//Database.addUser(createdDevice.deviceJSON);
	return createdDevice;
}

function loadDeviceFromJSON(deviceJSON){
	var createdDevice=new Device('');
	createdDevice.attachJSON(deviceJSON);
	return createdDevice;
}

function attachJSON(deviceJSON){
	this.deviceJSON=deviceJSON;
	this.device_name=deviceJSON.current_device_name;
};


function joinNetwork(network){
	  var oldNetwork= this.deviceJSON.current_network;
	  this.deviceJSON.current_network=network.name;
	  this.networkObject = network;
	  this.deviceJSON.current_partition=network.networkJSON.partition;
	  this.deviceJSON.current_network=network.network_name;
	  
};
  
function leaveNetwork(network){
	  this.deviceJSON.current_network= '';
	  this.networkObject = {};
	  this.deviceJSON.current_partition= 'freelist';
	  var networkIndex= network.device_list.indexOf(device);
	  networks.splice(networkIndex,1);
};

//This is supposed to make the device join the network it used to be in. idk lol
function returnNetwork(){
};
 
function replicateRDT(rdt){
	  this.rdt = rdt
};

function accessRDT(){
    // Access the previously registered replicated data type in the device
	return this.rdt;
};

module.exports.createNewDevice = createNewDevice;
module.exports.loadDeviceFromJSON=loadDeviceFromJSON;
