/*************************************************
 * Getter methods for the local device object 
 **************************************************/

function getLocalDeviceToken(){
	if(local_device!==null){
		var local_device = get_local_device();
		return local_device.token;
	}
	else{
		console.log("Error: getLocalDeviceToken passed a null local_device");
	}
}

/**
 * gets whether the device of the user is verified or not
 */
function getVerified(){
	var local_device = get_local_device();
	if(local_device!==null){
		if(local_device.hasOwnProperty('verified')){
			return local_device.verified;
		}else{
			return false;
		}
	}
	else{
		console.log("Error: getVerified passed a null local_device");
	}
}