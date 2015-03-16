/*************************************************
 * Getter methods for the local device object 
 **************************************************/

function getLocalDeviceToken(){
	var local_device = get_local_device();
	if(local_device!==null && local_device !== undefined){
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

function getLocalDeviceId(){
	var local_device = get_local_device();
	if(local_device!==null && local_device !== undefined){
		return local_device._id;
	}
	else{
		console.log("Error: getLocalDeviceToken passed a null local_device");
	}
}

function getLocalDeviceLogs(){
	var local_device = get_local_device();
	if(local_device!==null){
		return local_device.activity;
	}
	else{
		console.log("Error:getLocalSimulationLogs passed null simulation object");
		return '';
	}
}