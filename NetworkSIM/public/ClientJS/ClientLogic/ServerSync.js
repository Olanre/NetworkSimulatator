/**
 * syncs with the server every 2 seconds
 */
var socket = io.connect();

var connected = false;

/***
 * Handles creating a connection to the server
 */
function syncWithServer(){
	var route = '/getSync';
	var event_data = '';
	
	local_events = get_local_events();
	//console.log(local_events);
	if(local_events == null){
		event_data = JSON.stringify(newEventQueue());	
	}
	else{
		var event_data = JSON.stringify(local_events);
	}	
	//emit to our listening socket server
	socket.emit(route, event_data );
}



/**
 * Callback function for receiving a new appState object (all information we need from the server)
 */
socket.on('syncState', function(appState){
	//reset the current event queue after sending an item
	clearEventQueue();
	if(appState !== null){
		console.log(appState);
		//store_local_history({});
		store_local_simulation(appState.simulation);
		store_local_device(appState.device);
		store_local_simulation_list(appState.simulation_list);
	}
	else{
		console.log('recieved null object from server');
	}
});

socket.on('syncHistory',  function(appHistory){
	if( isEmpty(appHistory) == false){
		store_local_history(appHistory);
		console.log(appHistory);
	}else{
		console.log('recieved empty object from server for simulation history');
	}
});

/**
 * validate_user verifies whether the token input by the user is valid or not
 *
 * NOTE: if the token is invalid this should be displayed on the page rather than
 * in an alert
 */
socket.on('validate_user', function(data){
	object = data;
	console.log(data);
	//if the authentication was a success
	if(object.Response == 'Success'){
		alert('You have been authenicated. \nPlease wait to be redirected');
		//sync with the server and redirect to the simulation
		syncWithServer();	
	}else{
		alert('Token invalid \nPlease enter the correct token for this simulation')
	}
});

socket.on('connect', function () {
	connected = true;
	console.log('Socket is connected.');
	var time_stamp = new Date();
	var event_data = { 'num_devices': 1,
			  'num_networks': 1,
			  'simulation_population': 0,
			  'simulation_name': 'Test',
			  'globalcount': 0,
			  'tokenMethod': 'Email',
			  'config_map': { 'frfr': { 'ggn': { 'device1' : 1 } } },
			  'activity_logs': '' };

	//creates the query to the server
	var simulations = get_local_simulation_list();
	addToEventQueue('/create/Simulation', event_data, time_stamp);
	syncWithServer();
});

socket.on('disconnect', function () {
	  console.log('Socket is disconnected.');
});