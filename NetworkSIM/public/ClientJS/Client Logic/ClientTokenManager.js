/**
 * Handles all involving the client's token
 */

/**
 * Attaches a token to the user.
 * local_device is the device for this user which is stored in local storage
 */
function attachToken(new_token){
	//gets the user information out of local storage
	var local_device = get_local_device();
	
	if(local_device !== null){
		local_device.token = new_token;
		putinStorage( 'device', JSON.stringify(local_device) );
	}
	else{
		//ERROR SHOULD BE HANDLED OR SOMETHING SHOULD BE DONE
		console.log("Local device does not exist");
	}
}