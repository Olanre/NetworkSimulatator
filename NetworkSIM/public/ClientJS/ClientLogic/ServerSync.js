/**
 * syncs with the server every 2 seconds
 */
window.setInterval(function(){
	syncWithServer();
}, 2000);

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
	sendEventsToServer(route, event_data, getInformationFromServer);
}

/**
 * sends the event queue to the server
 */
function sendEventsToServer(route, event_data, callback){
	
    var request = new XMLHttpRequest();
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		request=new XMLHttpRequest();
	}
    else{// code for IE6, IE5
    	request=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
        	//resets the event queue to empty
        	clearEventQueue();
        	var parsedObject = JSON.parse(request.responseText);
        	//calls the callback function on the object returned from the server
            callback(parsedObject);
        }
    }; 
    request.open('POST', route);
    request.send(event_data);
}

/**
 * Callback function for receiving a new appState object (all information we need from the server)
 */
function getInformationFromServer(appState){
	if(appState !== null){
		store_local_simulation(appState.simulation);
		store_local_device(appState.device);
		store_local_simulation_names(appState.simulation_names);
	}
	else{
		console.log('recieved null object from server');
	}
}