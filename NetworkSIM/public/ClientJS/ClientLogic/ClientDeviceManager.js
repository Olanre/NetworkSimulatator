/** 
 * Creates a new device in this simulation. This is not what is called when a simulation is created,
 * that is coming different.
 */
function createDevice(device_name){
	var local_simulation = get_local_simulation();
	var params = { 
			'device_name': device_name, 
			'simulation_name': local_simulation.simulation_name,
			};
	var url = '/create/Device';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	addDeviceToFreeList( device_name );
}

/**
 * adds a device to the free list of this simulation 
 */
function addDeviceToFreeList(device_token){
	var local_simulation = get_local_simulation();
	var params = { 
			'simulation_name': local_simulation.simulation_name,
			'device_token' :  device_token,
			};
	var url = '/add/Device/FreeList';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timestamp);
}

/**
 * removeDevicefromFreeList: remove a device from the freelist
 * @param device_name: the name of the device to removed from the free list
 */
function removeDevicefromFreeList( token, simulation_name){
	//gets the current state of the simulation
	var local_simulation = get_local_simulation();
	if(local_simulation !== null){
		var params = { 
				'simulation_name': local_simulation.simulation_name,
				'device_name' :  device_name
				};
		var url = '/remove/Device/FreeList';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("local simulation session not found!");
	}
	
}

/** remove a device from its current network and adds 
 * the same device in the new specified network
 * used only at the local device level
 */
function addDevice( token, network_name){
	//gets the information of this user
	var local_device = get_local_device();
	last_network = getNetwork(device_name);
	removeDevicefromNetwork( device_name, last_network);
	addDeviceToNetwork( device_name, network_name);
	//gets the default page for the user.
	appDefaultView();
}

/**
 * adds a device to a network
 */
function addDeviceToNetwork( token, network_name){
	//gets the current state of the simulation
	var local_simulation = get_local_simulation();
	//gets the information of this user
	var local_device = get_local_device();
	if(local_simulation !== null || local_device !== null){
		//gets the partition of the network 
		var partition_name = getPartition(network_name);
		//send the information to the eventQueue for syncing with the server
		var params = { 
				'network_name': network_name, 
				'partition_name': partition_name , 
				'simulation_name': local_simulation.simulation_name,
				'device_name' :  device_name
				};
		var url = '/add/Device/Network';
		var timestamp = new Date();
		//add to the event queue to sync with server
		addToEventQueue(url, params, timestamp);
		
	}else{
		console.log("Local device or local session does not exist");
	}
}

/**
 * removes a device from a certain network.
 */
function removeDevicefromNetwork(token, network){
	//gets the user from storage
	var local_device = get_local_device;
	//gets the simulation from storage
	var local_simulation = get_local_simulation();
	if(local_device !== null && local_simulation !== null){
		//gets the partition which the user is part of
		partition = getPartitionfromDevice( device_name);
		if(partition !== null){
			
			var params = { 
					'network_name': network, 
					'partition_name': partition , 
					'simulation_name': local_simulation.simulation_name,
					'device_name' :  device_name
					};
			var url = '/remove/Device/Network';
			var timestamp = new Date();
			addToEventQueue(url, params, timestamp);
		}else{
			console.log("partition not found!")
		}
	}else{
		console.log("Local device or local session not found!")
	}
}

