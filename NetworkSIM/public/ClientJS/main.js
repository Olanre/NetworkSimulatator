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
.
/**
 * set a request to refresh our application with the server every 3 seconds
 * Will be changed later to using websockets with socket.io
 */ 
window.setInterval(function(){
	  /// call our sync function here
		Sync2Server();
	}, 2000);


/**
 * function overwrites the "appstate" array above with new data.
 * The "new_state" object will be an "appstate" as outlined in the JSON API Calls document"
 */
function overWriteAppState(new_state){
	//replaces the current appstate with new_state
	var appstate = new_state;  
	//updates the user with the user of the new_state.
	var local_device = appstate.device;
	//local session is the current session for this device, stored in local storage
	var local_session = appstate.current_simulation_session;
	//the states of the simulation object
	var states = appstate.states;
	
	
	//if the current session has a configuration map
	//WHEN WOULD THIS NOT HAPPEN? I guess on initialization?
	if( local_session.config_map !== null ){
		//converts the local_session 
		//CHANGE THIS VARIABLE NAME TO SOMETHING NOT STRING
		var String = local_session.config_map.toString();
		//what are we doing here? If this is a check for something, isn't there a stronger way
		//to do this? Is this checking if it is a JSON object?
		if(String.substr(0,1) == '{'){
			//decodes the local session if it is a JSON object.
			local_session.config_map = JSON.parse(local_session.config_map);
		}
		
	}
	//sets the current application on this device to the new state.
	local_application = appstate.application;
	//places all of the changes into the local storage of the device
	putinStorage( 'appstate', JSON.stringify(appstate) );
	putinStorage('states', JSON.stringify(states) );
	putinStorage( 'session', JSON.stringify(local_session) );
	putinStorage( 'device', JSON.stringify(local_device) );
	putinStorage( 'application', JSON.stringify(local_application) );
}

/**
 * addToEventQueue adds an event to the event queue of this device to be sent to the server.
 * @method: is how the server should handle this event in the form of a URL
 * @params: is the data which accompanies this event
 * @timeStamp: is the time at which this event occurred
 */
function addToEventQueue(url, params, timeStamp){
	
	//gets the list of the events which have occurred on this device since it last contacted the server.
	var local_events = get_local_events();
	if(local_events !== null){
		//now add it to the simulation logging or device logging
		generateActivity(url, params, timeStamp);
		
		//gets the eventQueue from the local storage.
		var events = local_events.eventQueue;
		//creates the query to the server, this constitutes an event in the event queue
		var query = {'URL': url, 'Body' : params, 'timestamp': timeStamp}
		//adds the event to the event queue
		events.push(query);
		//updates the localEvents to the new list of local events.
		local_events.eventQueue = events;
		local_events.token = getToken();  
		local_events.simulation = getSimulationName();
		
		putinStorage( 'localevents', JSON.stringify(local_events) );
	}
	else{
		console.log("Local events not found")
	}
	
}

/**
 * newEventQueue creates an empty event queue.
 */
function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	putinStorage( 'localevents', JSON.stringify(queue) );
	return queue;

}

