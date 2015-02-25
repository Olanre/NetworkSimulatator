/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */

var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Device(deviceName,token){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.token = token;
	this.networkObject={};
	this.device_name  = deviceName;
	this.rdt = {};
	this.deviceJSON=module.exports.getTemplate();
	this.deviceJSON.current_device_name=this.device_name;
	this.deviceJSON.token=this.token;
	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	
	//Our Functions//
	this.save=save;
	this.getJSON=getJSON;
}

function createNewDevice(deviceName,token){
	var createdDevice=new Device(deviceName,token);
	console.log(createdDevice.deviceJSON);
	Database.addUser(createdDevice.deviceJSON);
	return createdDevice;
}

function loadDeviceFromJSON(deviceJSON){
	var createdDevice=new Device('');
	attachJSON(createdDevice,deviceJSON);
}

function attachJSON(deviceObject,deviceJSON){
	deviceObject.deviceJSON=deviceJSON;
	deviceObject.device_name=deviceJSON.current_device_name;
	deviceObject.token = deviceJSON.token;
	deviceObject.networks_created = deviceJSON.networks_created;
};


function joinNetwork(network){
	  var oldNetwork= this.deviceJSON.current_network;
	  //we have to assign this to an object so that we can handle it within the callback. Actually this is
	  //a big problem and should be avoided and we must redo this next iteration.
	  var deviceThisObject=this;
	  Database.getSimByName(deviceThisObject.deviceJSON.current_simulation,function(simulationJSON){
		  var list=simulationJSON.config_map['freelist'];
		  if( list.hasOwnProperty(deviceThisObject.deviceJSON.current_device_name )){
			  delete simulationJSON.config_map.free_list[deviceThisObject.deviceJSON.current_device_name];
		  }
		  /* this probably doesn't have to be done. SimulationManager takes care of the config map for us :)
		  delete simulationJSON.config_map[deviceThisObject.deviceJSON.current_partition][oldNetwork][deviceThisObject.deviceJSON.current_device_name];
		  var indexInNetwork=util.size(simulationJSON.config_map[network.networkJSON.partition][network.network_name]);
		  simulationJSON.config_map[network.networkJSON.partition][network.network_name][deviceThisObject.deviceJSON.current_device_name]=indexInNetwork;
		  */
		  Database.modifySimByName(deviceThisObject.deviceJSON.current_simulation,simulationJSON,function(){});
		 
	  });
	  
	  this.deviceJSON.current_network=network.name;
	  this.networkObject = network;
	  this.deviceJSON.current_partition=network.networkJSON.partition;
	  this.deviceJSON.current_network=network.network_name;
	  Database.modifyUser(this.deviceJSON.token,this.deviceJSON,function(){});
	  delete network.device_list;
	  
};
  
function leaveNetwork(network){
    // Make the device leave connected network
	  network.removeDevice(this);
	  var deviceThisObject=this;
	  Database.getSimByName(deviceThisObject.deviceJSON.current_simulation,function(simulationJSON){
		  var num = Util.size(Sim.config_map['freelist']);
		  Sim.config_map['freelist'][deviceThisObject.deviceJSON.current_device_name] = num;
			
		  delete simulationJSON.config_map[deviceThisObject.deviceJSON.current_partition][network.network_name][deviceThisObject.deviceJSON.current_device_name];
		  var indexInNetwork=util.size(simulationJSON.config_map[network.partition][network.network_name]);
		  simulationJSON.config_map[network.partition][network.network_name][deviceThisObject.deviceJSON.current_device_name]=indexInNetwork;
		  Database.modifySimByName(deviceThisObject.deviceJSON.current_simulation,simulationJSON,function(){});
			 
	  });
	  this.deviceJSON.current_network= '-';
	  this.networkObject = {};
	  this.deviceJSON.current_partition= 'freelist';
	  Database.modifyUser(this.deviceJSON.token,this.deviceJSON,function(){});
	  var networkIndex= network.device_list.indexOf(device);
		networks.splice(networkIndex,1);
};
  
function getJSON(){
	  return this.deviceJSON;
}

//this method does not exist in mongooseConnect, Emily.
function save(){
	  Database.modifyUserbyToken(this.deviceJSON.token, this.deviceJSON);
}

//returns the network this device is connected to
function returnNetwork(){
	return this.networkObject;
};
 
function replicateRDT(rdt){
    // Register a replicated data type in the device
	  this.rdt = rdt
};

function accessRDT(){
    // Access the previously registered replicated data type in the device
	return this.rdt;
};


module.exports.getTemplate=function(){
	  var device_data = {};
	  device_data.token = "";
	  device_data.email = "";
	  device_data.verified = false;
	  device_data.current_partition = "";
	  device_data.current_network = "";
	  device_data.registeredOn = "";
	  device_data.admin = false;
	  device_data.networks_created = ['hallo'];
	  device_data.application_id =  "default";
	  device_data.current_simulation = "";
	  device_data.current_device_name = "";
	  device_data.activity = "";
	  return device_data;
	  
};

module.exports.createNewDevice = createNewDevice;
module.exports.loadDeviceFromJSON=loadDeviceFromJSON;
