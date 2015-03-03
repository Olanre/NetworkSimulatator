/*****
 * Main.js holds all of the javascript for the client 
 * 
 * Variables:
 * ------------
 * user_data: holds the variables related to the current user
 * session_data: holds the variables related to the current simulation which this 
 *               device is a member of
 * application: holds the variables related to the application
 * app_state: 
 * local_events: holds the events that have occurred on this device since the last contact with the server
 *             after contact with the server, this list is wiped.
 * local_session: The current session of the application on this device, it is stored 
 *              in local storage and updated every time the device synchronises with the 
 *              server.
 * config_map: A variable contained in "local_session", holds the current configuration of the 
 *             simulation, which is made up of the current partitions, the networks within these partitions, 
 *             and the devices within these networks.
 * local_application: ?holds the current application for the device? 
 * local_events: holds all the events that have
 * local_device: holds the data about this user to which these variables are native.
 *****/



/**
 * Function to be executed when the page loads up
 * first set the default side bar view
 * then get the style sheets needed and load out App content 
 */
window.onload = function(){
	defaultsideBarView();
	loadStyleSheet('../css/bootstrap.min.css');
	loadStyleSheet('../css/dashboard.css');
	
	loadAppContent();	

}

/**
 * set a request to refresh our application with the server every 3 seconds
 * Will be changed later to using websockets with socket.io
 */ 
//window.setInterval(function(){
	  /// call our sync function here
		//Sync2Server();
	//}, 2000);



