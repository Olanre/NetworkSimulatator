function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	putinStorage( 'localevents', JSON.stringify(queue) );
	return queue;
}

function addToEventQueue(route, event_data, time_stamp){
	var local_events = get_local_events();
	if(local_events !== null){
		var events = local_events.eventQueue;
		//creates the query to the server, this constitutes an event in the event queue
		var query = {'route': route, 'event_data' : event_data, 'time_stamp': time_stamp}
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