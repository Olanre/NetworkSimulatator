/**
 * Code for managing networks on the client side
 */

/**
 * Creates a network
 */
function createNetwork(network_name){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//creates the body of the event
		var params = { 
				'network_name': network_name, 
				'simulation_id': local_simulation._id,
				};
		var url = '/create/Network';
		var timestamp = new Date();
		//adds the event to the event queue
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("createNetwork recieved null parameters");
	}
}

/**
 * Wrapper to make a network on the network create page
 */
function Device_makeNetwork(element){
	//gets the name of the network input on the page
	var input = document.getElementById(element);
	if(input !== null ){
		var name = input.value;
		if(name !== ''){
			//creates a network with this name
			createNetwork(name);
		}
		else{
			console.log("Device_makeNetwork recieved null parameters");
		}
	}
	else{
		console.log("Device_makeNetwork recieved null parameters");
	}
}


