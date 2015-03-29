/**
 * New node file
 */

function login(user_name, password){
	var timestamp = new Date();
	//sets the body of the message to the server to be the token
	var body = {'user': user_name, 'password': password, 'time_stamp' : timestamp};
	params = JSON.stringify(body);
	socket.emit('/authenticate/authAdmin', params);
	
	
}


/**
 *Gets whether the user has been verified from the local storage
 */
function getAdminVerified(){
	var local_admin = get_local_admin();
	if(local_admin !== undefined && local_admin !== null){
		return local_admin.verified;
	}else{
		return false;
	}
}

/**
 * Only used in the login page.
 * authenticateAdmin gets the user name and password from the login form
 */
function authenticateAdmin(){
	//gets the token from the html
	var userfield = document.getElementsByName('username')[0];
	var user_name = userfield.value;
	var passfield = document.getElementsByName('password')[0];
	var	password = passfield.value;
	
	if(user_name.length < 1){
		alert("A user name must be enetered");
	}
	if(password.length < 1){
		alert("A password must be entered");
	}
	if(user_name.length > 1 && password.length > 1){
		//sends the login credentials to be verified
		login(user_name, password);
		
	}
	
}