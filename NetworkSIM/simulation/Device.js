/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */

var Database=require("../Database/mongooseConnect.js");
var Util=require("./utilities.js");
function Device(deviceName){
	
	this.token = '';
	this.networkObject={};
	this.device_name  = '';
	this.rdt = {};
	this.networks_created = [];
	this.deviceJSON={};
	
	this.attachJSON=function(deviceJSON){
		this.deviceJSON=deviceJSON;
		this.token = deviceJSON.token;
		this.device_name = deviceJSON.curent_device_name;
		this.networks_created = deviceJSON.networks_created;
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
		  device_data.activity = '';
		  return device_data;
		  
	};
  //Required
  this.joinNetwork = function(network){
	  
	  var oldNetwork= this.deviceJSON.current_network;

	  Database.getSimByName(this.deviceJSON.current_simulation,function(simulationJSON){
		 var list.simulationJSON.config_map['freelist'];
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
	  delete network.deviceList()
	  
  };
  
  //Required
  this.leaveNetwork = function(network){
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
  
  this.getJSON = function(){
	  return this.deviceJSON;
  }
  
  this.save = function(){
	  Database.modifyUserbyToken(this.deviceJSON.token, this.deviceJSON);
  }
  //Required
  this.returnNetwork = function(){
	  //unsure about this
	  return this.networkObject;
    // Make the device re-join a previous network
  };
 
  //Required
  this.replicateRDT = function(rdt){
    // Register a replicated data type in the device
	  this.rdt = rdt
  };
  //Required
  this.accessRDT = function(){
    // Access the previously registered replicated data type in the device
	return this.rdt;
  };
  
};
