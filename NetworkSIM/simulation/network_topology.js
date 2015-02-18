var networkList;
var deviceList;


function NetworkIterator(){
  // An iterator over networks in the simulation
  this.index=0;
  
  this.first = function() {
    return networkList[0];
  };

  this.next = function() {
	  var network=networkList[index];
	  index++;
	  return network;
  };

  this.hasNext = function() {
    return this.index<networkList.length;
  };

  this.reset = function() {
    this.index=0;
  };

  this.each = function(callback) {
    // Invoke the callback function on each element
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}


function DeviceIterator(){
  // Similar to the NetworkIterator except the elements are devices
  this.index=0;
  this.first = function() {
	  return deviceList[0];
  };

  this.next = function() {
	  var device=deviceList[index];
	  index++;
	  return device;
  };

  this.hasNext = function() {
	  return this.index<deviceList.length;
  };

  this.reset = function() {
	  this.index=0;
  };

  this.each = function(callback) {
	  for (var item = this.first(); this.hasNext(); item = this.next()) {
	      callback(item);
	    }
  };
}


function Network(networkName, networkKind){
  // Construct a network object

  this.networkName = networkName; // String
  this.networkKind = networkKind; // Constant: WiFi, GSM
  this.deviceList=[];
  this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
  this.partition={};
  
  this.addDevice = function(device){
    deviceList.push(device);
  };

  this.removeDevice = function(device){
   var deviceIndex=deviceList.indexOf(device);
   deviceList.splice(deviceIndex,1);
  };

  this.connectNetwork = function(network){
    var partition=network.partition;
    this.partition=partition;
    partition.addNetwork(this);
  };

  this.disconnectNetwork = function(network){
    var partition=network.partition;
    if(this.partition===partition){
    	this.partition={};
    }
    partition.removeNetwork(this);
  };
  
}


function Device(deviceName, simulation, network, partition, token, email){
  // Fiech wants it done like this. I've made it consistent with how we did things before.

  this.current_device_name = deviceName;
  this.current_simulation=simulation;
  this.current_network=network;
  this.current_partition=partition;
  this.email=email;
  this.token=token;
  
  this.joinNetwork = function(network){
    // Make the device join a network
  };

  this.leaveNetwork = function(){
    // Make the device leave connected network
  };

  this.returnNetwork = function(){
    // Make the device re-join a previous network
  };

  this.replicateRDT = function(rdt){
    // Register a replicated data type in the device
  };

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
exports.Partition=Partition;
exports.NetworkIterator = NetworkIterator;
exports.DeviceIterator = DeviceIterator;
