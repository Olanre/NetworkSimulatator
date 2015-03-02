function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	putinStorage( 'localEvents', JSON.stringify(queue) );
	return queue;
}


/**
 * Adds an event to the event queue
 */
function addToEventQueue(route, event_data, time_stamp){
	var local_events = get_local_events();
	if(local_events !== null){
		var events = local_events.eventQueue;
	}
	else{
		local_events = newEventQueue();
	}
	//creates the query to the server
	var query = {'route': route, 'event_data' : event_data, 'time_stamp': time_stamp}
	events.push(query);

	local_events.eventQueue = events;
	local_events.token = getToken();  
	local_events.application = getApplicationName();
	
	putinStorage( 'localEvents', JSON.stringify(local_events) );
}

/**
 * Clears the event queue
 */
function clearEventQueue(){
	local_events = get_local_events();
	if(local_events !== null){
		local_events.eventQueue = [];
		putinStorage( 'localEvents', JSON.stringify(local_events) );
	}
	else{
		local_events = newEventQueue();
	}
}