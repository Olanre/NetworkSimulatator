/*************************************************
 * Getter methods for the local device object 
 **************************************************/

function getLocalDeviceToken(){
	var local_device = get_local_device();
	return local_device.token;
}

/**
 * gets whether the device of the user is verified or not
 */
function getVerified(){
	var local_device = get_local_device();
	
	if(local_device.hasOwnProperty('verified')){
		return local_device.verified;
	}else{
		return false;
	}
}