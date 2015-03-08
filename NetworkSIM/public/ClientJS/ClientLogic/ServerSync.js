/**
 * syncs with the server every 2 seconds
 */
var socket = io.connect();

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
		console.log('recieved new object from the server');
		store_local_simulation(appState.simulation);
		store_local_device(appState.device);
		store_local_simulation_names(appState.simulation_names);
	}
	else{
		console.log('recieved null object from server');
	}
});

socket.on('connect', function () {
	 console.log('Socket is connected.');
	 syncWithServer();
});

socket.on('disconnect', function () {
	  console.log('Socket is disconnected.');
});