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