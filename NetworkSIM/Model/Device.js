var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var DevModel = require("../Database/dbModels/userModel.js");

function Device(deviceName,token, simulation_name , email){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.networkObject=Network.createNewNetwork('','');
	this.networks_created = [];
	this.rdt = {};
	this.token=token;
	this.deviceJSON = {};
	this._id= token;

	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	
	//Our Functions//
	this.attachJSON=attachJSON;
	this.updateDeviceLog = updateDeviceLog;

	//Constructor contents

	//Editing the JSON which represents the device. This will have to change when the database finally works.
	

	this.networkObject.addDevice(this);
}


function createNewDevice(deviceName,token, simulation_id, email){
	var createdDevice = new Device(deviceName,token, simulation_id ,email);
	var deviceJSON = new DevModel();

	deviceJSON.current_device_name=deviceName;
	deviceJSON.current_simulation = simulation_id;
	deviceJSON.admin=false;
	deviceJSON.verified=false;
	
	deviceJSON.email = deviceName;
	deviceJSON.token=token;
	createdDevice.deviceJSON=deviceJSON;

	deviceJSON.save();

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
	this.token=deviceJSON.token;
	this._id=deviceJSON.token;
};


function joinNetwork(network){
	  this.deviceJSON.current_network=network.name;
	  this.networkObject = network;
	  this.deviceJSON.current_partition=network.networkJSON.partition;
	  this.deviceJSON.current_network=network.network_name;
	  
};
  
function leaveNetwork(network){
	  this.deviceJSON.current_network= '';
	  this.networkObject = {};
	  this.deviceJSON.current_partition= 'freelist';
	  var networkIndex= network.device_list.indexOf(this);
	  network.device_list.splice(networkIndex,1);
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

function updateDeviceLog(new_activity){
	this.deviceJSON.activity += new_activity;
}


module.exports.createNewDevice = createNewDevice;
module.exports.loadDeviceFromJSON=loadDeviceFromJSON;
