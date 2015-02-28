
function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	putinStorage( 'localevents', JSON.stringify(queue) );
	return queue;
}

function addToEventQueue(route, params, timeStamp){
	//gets the list of the events which have occurred on this device since it last contacted the server.
	var local_events = get_local_events();
	if(local_events !== null){
		//now add it to the simulation logging or device logging
		generateActivity(route, params, timeStamp);
		
		//gets the eventQueue from the local storage.
		var events = local_events.eventQueue;
		//creates the query to the server, this constitutes an event in the event queue
		var query = {'route': route, 'Body' : params, 'timestamp': timeStamp}
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