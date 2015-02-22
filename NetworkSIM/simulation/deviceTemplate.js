/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */
	
function getDeviceTemplate(){
	var device_data = {}
	device_data.token = '';
	device_data.email = '';
	device_data.verified = false;
	device_data.current_network = '';
	device_data.current_simulation = '';
	device_data.registeredOn = '';
	device_data.networks_created = [];
	device_data.current_partition = '';
	device_data.current_device_name = '';
	device_data.application_id =  'default';
	device_data.admin = false;
	device_data.localcount = 0;
	device_data.globalcount = 0;
	device_data.activity = '';
	return device_data;
}

	this.joinNetwork = function(network){
    // Make the device join a network
	  
  };
  //Required
  this.leaveNetwork = function(){
    // Make the device leave connected network
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

module.exports.getDeviceTemplate = getDeviceTemplate;