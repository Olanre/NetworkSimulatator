/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */

var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");

function Device(deviceName){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.token = '';
	this.networkObject={};
	this.device_name  = deviceName;
	this.rdt = {};
	this.deviceJSON=module.exports.getTemplate();
	this.deviceJSON.current_device_name=this.device_name;
	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	
	//Our Functions//
	this.save=save;
}

function createNewDevice(deviceName){
	var createdDevice=new Device(deviceName);
	return createdDevice;
}

function createDeviceFromJSON(deviceJSON){
	var createdDevice=new Device('');
	attachJSON(createdDevice,deviceJSON);r
}

function attachJSON(deviceObject,deviceJSON){
	deviceObject.deviceJSON=deviceJSON;
	deviceObject.device_name=deviceJSON.current_device_name;
	deviceObject.token = deviceJSON.token;
	deviceObject.networks_created = deviceJSON.networks_created;
};
	

function joinNetwork(network){
	  
	  var oldNetwork= this.deviceJSON.current_network;

	  Database.getSimByName(this.deviceJSON.current_simulation,function(simulationJSON){
		var list=simulationJSON.config_map['freelist'];
		if( list.hasOwnProperty(this.deviceJSON.current_device_name) ){
			delete simulationJSON.config_map.free_list[this.deviceJSON.current_device_name];
		  }
		 delete simulationJSON.config_map[this.deviceJSON.current_partition][oldNetwork][this.deviceJSON.current_device_name];
		 var indexInNetwork=util.size(simulationJSON.config_map[network.partition][network.network_name]);
		 simulationJSON.config_map[network.partition][network.network_name][this.deviceJSON.current_device_name]=indexInNetwork;
		 Database.modifySimByName(this.deviceJSON.current_simulation,simulationJSON,function(){});
		 
	  });
	  
	  this.deviceJSON.current_network=network.name;
	  this.networkObject = network;
	  this.deviceJSON.current_partition=network.partition;
	  Database.modifyUser(this.deviceJSON.token,this.deviceJSON,function(){});
	  delete network.deviceList();
	  
};
  
function leaveNetwork(network){
    // Make the device leave connected network
	  network.removeDevice(this);
	  Database.getSimByName(this.deviceJSON.current_simulation,function(simulationJSON){
		  var num = Util.size(Sim.config_map['freelist']);
		  Sim.config_map['freelist'][this.deviceJSON.current_device_name] = num;
			
		 delete simulationJSON.config_map[this.deviceJSON.current_partition][network.network_name][this.deviceJSON.current_device_name];
		 var indexInNetwork=util.size(simulationJSON.config_map[network.partition][network.network_name]);
		 simulationJSON.config_map[network.partition][network.network_name][this.deviceJSON.current_device_name]=indexInNetwork;
		 Database.modifySimByName(this.deviceJSON.current_simulation,simulationJSON,function(){});
			 
	  });
	  this.deviceJSON.current_network= '-';
	  this.networkObject = {};
	  this.deviceJSON.current_partition= 'freelist';
	  Database.modifyUser(this.deviceJSON.token,this.deviceJSON,function(){});
	  var networkIndex= network.deviceList.indexOf(device);
		networks.splice(networkIndex,1);
};
  
function getJSON(){
	  return this.deviceJSON;
}
  
function save(){
	  Database.modifyUserbyToken(this.deviceJSON.token, this.deviceJSON);
}

function returnNetwork(){
    // Make the device re-join a previous network
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
	  device_data.token = '';
	  device_data.email = '';
	  device_data.verified = false;
	  device_data.current_partition = '';
	  device_data.current_network = '';
	  device_data.registeredOn = '';
	  device_data.admin = false;
	  device_data.networks_created = [];
	  device_data.application_id =  'default';
	  device_data.current_simulation = '';
	  device_data.current_device_name = '';
	  device_data.activity = '';
	  return device_data;
	  
};

module.exports.createNewDevice = createNewDevice;
module.exports.createDeviceFromJSON=createDeviceFromJSON;
