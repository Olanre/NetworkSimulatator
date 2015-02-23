/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */

var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");
function Device(deviceName){
	
	this.token = '';
	this.networkObject={};
	this.simulationObject={};
	this.networks_created = [];
	this.deviceJSON={};
	
	this.attachJSON=function(deviceJSON){
		this.deviceJSON=deviceJSON;
	};
	this.getTemplate=function(){
		  var device_data = {};
		  device_data.token = '';
		  device_data.email = '';
		  device_data.verified = false;
		  device_data.current_network = '';
		  device_data.current_simulation = '';
		  device_data.registeredOn = '';
		  device_data.networks_created = [];
		  device_data.current_partition = '';
		  device_data.current_device_name = device_name;
		  device_data.application_id =  'default';
		  device_data.admin = false;
		  device_data.localcount = 0;
		  device_data.globalcount = 0;
		  device_data.activity = '';
		  return device_data;
		  
	};
  //Required
  this.joinNetwork = function(network){
	  
	  var oldNetwork=deviceJSON.current_network;

	  Database.getSimByName(deviceJSON.current_simulation,function(simulationJSON){
		  
		 delete simulationJSON.config_map[deviceJSON.current_partition][oldNetwork][deviceJSON.current_device_name];
		 var indexInNetwork=util.size(simulationJSON.config_map[network.partition][network.name]);
		 simulationJSON.config_map[network.partition][network.name][deviceJSON.current_device_name]=indexInNetwork;
		 Database.modifySimByName(deviceJSON.current_simulation,simulationJSON,function(){});
		 
	  });
	  
	  deviceJSON.current_network=network.name;
	  deviceJSON.current_partition=network.partition;
	  Database.modifyUser(this.token,deviceJSON,function(){});
	  network.addDevice(this);
	  
  };
  
  //Required
  this.leaveNetwork = function(network){
    // Make the device leave connected network
	  network.removeDevice(this.current_device_name);
  };
  //Required
  this.returnNetwork = function(){
    // Make the device re-join a previous network
  };
  //Required
  this.replicateRDT = function(rdt){
    // Register a replicated data type in the device
  };
  //Required
  this.accessRDT = function(){
    // Access the previously registered replicated data type in the device
  };
  
};
