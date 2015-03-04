/** 
 * Creates a new device in this simulation. This is not what is called when a simulation is created,
 * that is coming different.
 */
function createDevice(){
	var local_simulation = get_local_simulation();
	if(local_simuation!==null){
		var params = { 
				'device_name': 'no name set', 
				'simulation_name': local_simulation.simulation_name,
				};
		var url = '/create/Device';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
		addDeviceToFreeList( device_name );
	}
	else{
		console.log("createDevice was passed null parameters");
	}
}

/** 
 * moves a device to a network by removing it from the previous network it was in and adding it to the new network.
 */
function moveDeviceToNetwork( device_token, network_name){
	if (device_token!==null &&network_name!==null){
		last_network = getNetwork(device_token);
		removeDevicefromNetwork( device_token, last_network);
		addDeviceToNetwork(device_token, network_name);
		//gets the default page for the user.
		appDefaultView();
	}
	else{
		console.log("moveDeviceToNetwork recieved null parameters");
	}
}

/**
 * adds a device to a network
 */
function addDeviceToNetwork( device_token, network_name){
	var local_simulation = get_local_simulation();
	if(device_token!==null && network_name!==null&&local_simulation!==null){
		var params = { 
				'network_name': network_name, 
				'simulation_name': local_simulation.simulation_name,
				'device_name' :  device_name
				};
		var url = '/add/Device/Network';
		var timestamp = new Date();
		//add to the event queue to sync with server
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("addDeviceToNetwork recieved null parameters");
	}
}

/**
 * removes a device from a certain network.
 */
function removeDeviceFromNetwork(device_token, network_name){
	var local_simulation = get_local_simulation();
	if(device_token!==null && network_name!==null&& local_simulation!==null){
		var params = { 
				'network_name': network_name, 
				'simulation_name': local_simulation.simulation_name,
				'device_name' :  device_name
				};
		var url = '/remove/Device/Network';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}
	else{
		console.log("removeDeviceFromNetwork was passed null parameters")
	}
}

