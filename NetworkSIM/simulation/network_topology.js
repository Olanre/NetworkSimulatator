var networkList;
var deviceList;


function NetworkIterator(){
  // An iterator over networks in the simulation

  this.first = function() {
    // Return the first element
  };

  this.next = function() {
    // Return the next element
  };

  this.hasNext = function() {
    // Determine if there are more elements to iterate
  };

  this.reset = function() {
    // Reset the iterator to its initial state so it can be re-used
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

  this.first = function() {
  };

  this.next = function() {
  };

  this.hasNext = function() {
  };

  this.reset = function() {
  };

  this.each = function(callback) {
  };
}


function Network(networkName, networkKind){
  // Construct a network object

  this.networkName = networkName; // String
  this.networkKind = networkKind; // Constant: WiFi, GSM

  this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects

  this.addDevice = function(device){
    // Adds a device object to the network
  };

  this.removeDevice = function(device){
    // Remove the device object from the network
  };

  this.connectNetwork = function(network){
    // Connect the network to another
  };

  this.disconnectNetwork = function(network){
    // Disconnect the network from another
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

exports.Device = Device;
exports.Network=Network;
exports.Partition=Partition;
exports.NetworkIterator = NetworkIterator;
exports.DeviceIterator = DeviceIterator;
