/**
 * New node file
 */

	
function getDeviceState(){
	var user_data = {}
	user_data.token = '';
	user_data.email = '';
	user_data.clientid = '';
	user_data.verified = false;
	user_data.current_network = '';
	user_data.current_simulation = '';
	user_data.registeredOn = '';
	user_data.networks_created = [];
	user_data.current_partition = '';
	user_data.current_device_name = '';
	user_data.application_id =  'default';
	user_data.admin = false;
	user_data.localcount = 0;
	user_data.globalcount = 0;
	return user_data;
}

module.exports.getDeviceState = getDeviceState;