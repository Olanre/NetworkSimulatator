//Required
var networkList;
//Required
var deviceList;

var partitionList;


/****
 * Required
 ****/
function NetworkIterator(){
  // An iterator over networks in the simulation
  this.index=0;
  //Required
  this.first = function() {
    return networkList[0];
  };
  //Required
  this.next = function() {
	  var network=networkList[index];
	  index++;
	  return network;
  };
  //Required
  this.hasNext = function() {
    return this.index<networkList.length;
  };
  //Required
  this.reset = function() {
    this.index=0;
  };
  //Required
  this.each = function(callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}

/****
 * Required
 ****/
function DeviceIterator(){
  // Similar to the NetworkIterator except the elements are devices
  this.index=0;
  //Required
  this.first = function() {
	  return deviceList[0];
  };
  //Required
  this.next = function() {
	  var device=deviceList[index];
	  index++;
	  return device;
  };
  //Required
  this.hasNext = function() {
	  return this.index<deviceList.length;
  };
  //Required
  this.reset = function() {
	  this.index=0;
  };
  //Required
  this.each = function(callback) {
	  for (var item = this.first(); this.hasNext(); item = this.next()) {
	      callback(item);
	    }
  };
}

/****
 * Required
 ****/
function Network(networkName, networkKind){
  //Required
  this.networkName = networkName; // String
  //Required
  this.networkKind = networkKind; // Constant: WiFi, GSM
  //Required
  this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
  
  this.partition={};
  this.deviceList=[];
  
  //Required
  this.addDevice = function(device){
    deviceList.push(device);
  };

  //Required
  this.removeDevice = function(device){
   var deviceIndex=deviceList.indexOf(device);
   deviceList.splice(deviceIndex,1);
  };
  //Required.
  this.connectNetwork = function(network){
    var partition=network.partition;
    this.partition=partition;
    partition.addNetwork(this);
  };
  //Required
  this.disconnectNetwork = function(network){
    var partition=network.partition;
    if(this.partition===partition){
    	this.partition={};
    }
    partition.removeNetwork(this);
  };
  
}

/****
 * Required
 ****/


function Device(deviceName){
	this.deviceName=deviceName;
	this.token = '';
	this.email = '';
	this.verified = false;
	this.current_network = '';
	this.current_simulation = '';
	this.registeredOn = '';
	this.networks_created = [];
	this.current_partition = '';
	this.current_device_name = '';
	this.application_id =  'default';
	this.admin = false;
	this.localcount = 0;
	this.globalcount = 0;
	this.activity = '';
	
  //Required
  this.current_device_name = deviceName;
  this.device_number = deviceList.length;
  //Required
  this.joinNetwork = function(network){
    // Make the device join a network
	  network.addDevice(this.current_device_name)
	  
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
}

function Partition(partitionName){
	
	this.partition_name=partitionName;
	this.networks=[];
	
	this.addNetwork=function(network){
		networks.push(network);
	};
	this.removeNetwork=function(network){
		var networkIndex=networks.indexOf(network);
		networks.splice(networkIndex,1);
	};

	
}




exports.Device = Device;
exports.Network=Network;
//exports.Simulation = Simulation;
exports.NetworkIterator = NetworkIterator;
exports.DeviceIterator = DeviceIterator;
