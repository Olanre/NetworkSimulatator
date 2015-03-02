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
	console.log("SSSS");
	var route = '/getSync';
	var event_data = '';
	
	local_events = get_local_events();
	if(local_events == null){
		event_data = JSON.stringify(newEventQueue());	
	}
	else{
		var event_data = JSON.stringify(local_events);
	}	
	sendEventsToServer(route, event_data, render);
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
function render(new_data){
	var old_state = get_local_appstate();
	if(new_data !== null && new_data.appstate !== null){
		if( JSON.stringify(old_state) === JSON.stringify(new_data) ){
			//overwrite the app state with the old state as they are the same
			//actually, could we just leave everything as is?
			overWriteAppState(old_state);
		}else{
			//otherwise if the old and new states are not the same
			//update the old state with the new state
			overWriteAppState(new_data);
			//update all of the views.
			//updateAllViews(400);
		}
		
	}else{
		//if recieved an empty response
		alert('Something went wrong. Please try again');
	}
}