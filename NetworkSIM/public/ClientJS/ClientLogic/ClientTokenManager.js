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
function authToken(token){
	//sets the body of the message to the server to be the token
	var body = {'token': token};
	params = JSON.stringify(body);
	//sets the method by which the server handles the call. 
	var url = "/authenticate/authToken";
	//adds the event to the event queue
	updateLocalEventsToken(token);
	//sends the token to be validated by the server
	sendEventsToServer(url, params, validate_user);
}

/**
 *Gets whether the user has been verified from the local storage
 */
function getVerified(){
	var local_device = get_local_device();
	return local_device.verified;
}

/**
 * validate_user verifies whether the token input by the user is valid or not
 *
 * NOTE: if the token is invalid this should be displayed on the page rather than
 * in an alert
 */
function validate_user(data){
	object = data;
	//if the authentication was a success
	if(object.Response == 'Success'){
		alert('You have been authenicated. \nPlease wait to be redirected');
		//sync with the server and redirect to the simulation
		syncWithServer();	
	}
	else{
		alert('Token invalid \nPlease enter the correct token for this simulation')
	}
}

/**
 * ONLY FOR REGISTRATION PAGE
 * authenticate gets the token from the token input field on the registration page
 */
function authenticate(){
	//gets the token from the html
	var input = document.getElementsByName('tokenvalue')[0];
	var token = input.value;
	//sends the token to be verified
	authToken(token);
}