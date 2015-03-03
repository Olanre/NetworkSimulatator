
/**
 * Initializes the local_events, which will hold all of the events
 * which occur on this device. This list will be sent to the server
 * to be handled and recorded. This is stored in the JSON format.
 */ 
function newEventQueue(){
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	store_local_events(local_events);
	return queue;
}


/**
 * addToEventQueue adds an event to the event queue of this device to be sent to the server.
 * @route: is how the server should handle this event in the form of a URL
 * @event_data: is the data which accompanies this event
 * @timeStamp: is the time at which this event occurred
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
	local_events.simulation = getSimulationName();
	
	store_local_events(local_events);
}

/**
 * Clears the event queue
 */
function clearEventQueue(){
	local_events = get_local_events();
	if(local_events !== null){
		local_events.eventQueue = [];
		store_local_events(local_events);
	}
	else{
		local_events = newEventQueue();
	}
}