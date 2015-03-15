var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var DevModel = require("../Database/dbModels/userModel.js");

function Device(deviceName,token, simulation_name , email){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.networkObject=Network.createNewNetwork('','');
	this.networks_created = [];
	this.rdts = [];
	this.token=token;
	this.deviceJSON = {};
	this._id= token;

	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	this.attachAppSpec = attachAppSpec;
	
	//Our Functions//
	this.attachJSON=attachJSON;
	this.updateDeviceLog = updateDeviceLog;

	//Constructor contents
	

	
}


function createNewDevice(deviceName,token, simulation_id, email){
	var createdDevice = new Device(deviceName,token, simulation_id ,email);
	var deviceJSON = new DevModel();
	
	deviceJSON.current_device_name=deviceName;
	deviceJSON.current_simulation = simulation_id;
	deviceJSON.admin=false;
	deviceJSON.verified=false;
	deviceJSON.current_partition = '';
	deviceJSON.current_network = '';
	deviceJSON.activity = '';
	deviceJSON.email = deviceName;
	deviceJSON.token=token;
	createdDevice.deviceJSON=deviceJSON;

	createdDevice.networkObject.addDevice(createdDevice);
	deviceJSON.save();

	return createdDevice;
}

function loadDeviceFromDatabase(deviceID){
	var createdDevice=new Device('');
	DevModel.findOne({_id: deviceID}, function(err,deviceJSON){
		if(!err){
		 createdDevice.attachJSON(deviceJSON);
		}
	});
	return createdDevice;
}

function attachJSON(deviceJSON){
	this.deviceJSON=deviceJSON;
	this.device_name=deviceJSON.current_device_name;
	this.token=deviceJSON.token;
	this._id=deviceJSON.token;
};


function joinNetwork(network){
	  this.networkObject.removeDevice(this);
	  this.networkObject = network;
	  this.deviceJSON.current_partition=network.partitionObject._id;
	  this.deviceJSON.current_network=network._id;
	  this.deviceJSON.save();
	  
};
  
function leaveNetwork(network){
	  this.deviceJSON.current_network= '';
	  this.networkObject = {};
	  this.deviceJSON.current_partition= '';
	  var networkIndex= network.device_list.indexOf(this);
	  network.device_list.splice(networkIndex,1);
	  this.deviceJSON.save();
};

//This is supposed to make the device join the network it used to be in. idk lol
function returnNetwork(){
};
 
function replicateRDT(rdt){
	  this.rdts.push(rdt);
	  this.deviceJSON.save();
};

//acces an rdt by name
function accessRDT(rdt_name){
	for(var i = 0; i < rdts.length; i++){
		if(rdts[i].constructor.name == rdt_name) return this.rdts[i];
		
	}
};

function attachAppSpec( app_specJSON){
	this.deviceJSON.apps.push(app_specJSON._id);
}

function accessRDT(){
    // Access the previously registered replicated data type in the device
	var index = rdts.length-1;
	return this.rdts[index];
};

function updateDeviceLog(new_activity){
	this.deviceJSON.activity += new_activity;
	this.deviceJSON.save();
}


module.exports.createNewDevice = createNewDevice;
module.exports.loadDeviceFromDatabase=loadDeviceFromDatabase;
