/**
 * user_data holds all the variables related to the current user in an array.
 * This is the template for a user's device.
 */


	exports.getDevice = function getDevice(){
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
	}

	exports.joinNetwork = function(network){
	 
    // Make the device join a network
	  
  };
  
  export.updateDeviceName = function updateDeviceName(token, old_name, new_name, simulation){
	  Database.getUserByToken(token, function(Device){
		 Device.current_device_name =  new_name;
		 Database.saveUserByToken(token, Device);
	  });
  }
  //Required
  exports.leaveNetwork = function(){
    // Make the device leave connected network
  };
  //Required
  exports.returnNetwork = function(){
    // Make the device re-join a previous network
  };
  //Required
  exports.replicateRDT = function(rdt){
    // Register a replicated data type in the device
  };
  //Required
  exports.accessRDT = function(){
    // Access the previously registered replicated data type in the device
  };