/**
 * Attaches a token to the user.
 * local_device is the device for this user which is stored in local storage
 */
function attachToken(new_token){
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

/**
 * authToken sends a token to the server to be authenticated
 * @token: a token code given by the user
 */
function authToken(token, id){
	//sets the body of the message to the server to be the token
	var body = {'token': token, 'simulation_id': id};
	params = JSON.stringify(body);
	//sets the method by which the server handles the call. 
	var url = "/authenticate/authToken";
	//adds the event to the event queue
	updateLocalEventsToken(token);
	updateLocalEventsSimulationId(id);
	//sends the token to be validated by the server
	socket.emit('/authenticate/authToken', params);
}

/**
 *Gets whether the user has been verified from the local storage
 */
function getVerified(){
	var local_device = get_local_device();
	return local_device.verified;
}



/**
 * ONLY FOR REGISTRATION PAGE
 * authenticate gets the token from the token input field on the registration page
 */
function authenticate(){
	//gets the token from the html
	var input = document.getElementsByName('tokenvalue')[0];
	var token = input.value;
	var id = document.getElementById('simulation_id_div').value;
	//sends the token to be verified
	authToken(token, id);
}