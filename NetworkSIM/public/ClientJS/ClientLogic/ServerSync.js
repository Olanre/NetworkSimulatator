/**
 * syncs with the server every 2 seconds
 */
window.setInterval(function(){
	SyncWithServer();
}, 2000);

/**
 * sends the event queue to the server
 */
function SyncWithServer(){
	var route = '/getSync';
	var event_data = '';
	
	local_events = get_local_events();
	if(local_events == null){
		event_data = JSON.stringify(newEventQueue());	
	}
	else{
		var event_data = JSON.stringify(local_events);
	}	
	sendEventsToServer(route, event_data, getsimulationFromServer);
}

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
        	resetEventQueue();
        	var parsedObject = JSON.parse(request.responseText);
        	//calls the callback function on the object returned from the server
            callback(parsedObject);
        }
    }; 
    request.open('POST', route);
    request.send(event_data);
}

/**
 * Callback function for receiving a new simulation object from the server
 * Renders the simulation object
 */
function getsimulationFromServer(new_simulation){
	
	//get the previous simulation object from storage
	var old_simulation = get_local_simulation();
	if(new_simulation !== null && new_simulation !== null){
		if( JSON.stringify(old_simulation) === JSON.stringify(new_simulation) ){
		}
		else{
			store_local_simulation(new_simulation);
			//SHOULD UPDATE ALL OF THE VIEWS
		}
	}
	else{
		//if recieved an empty response
		console.log('ERROR: Retrieved null simulation object from server');
	}
	console.log(new_simulation);
}