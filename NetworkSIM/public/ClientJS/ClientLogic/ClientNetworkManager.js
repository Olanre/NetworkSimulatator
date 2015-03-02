function createNetwork(network_name){
	//gets the user information from storage
	var local_device = get_local_device();
	var local_session = get_local_session();
	var local_application = get_local_application();
	var partition = network_name;
	
	var params = { 
			'config_map' : local_session.config_map,
			'token': local_device.token,
			'network_name': network_name, 
			'partition_name': partition , 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Network';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	appDefaultView();
	//add to eventQueue
	//render Application View
	
}

/** remove a device from its current network and adds 
 * the same device in the new specified network
 * used only at the local device level
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 * 
 */
function addDevice( device_name, network_name){
	//gets the information of this user
	var local_device = get_local_device();
	last_network = getNetwork(device_name);
	removeDevicefromNetwork( device_name, last_name);
	addDevice2Network( device_name, network_name);
	//gets the default page for the user.
	appDefaultView();
}

/**
 * 
 */
function addDevice2Network( device_name, network_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	//gets the information of this user
	var local_device = get_local_device();
	if(local_session !== null || local_device !== null){
		//gets the configuration of the current simulation
		var map = local_session.config_map;
		//gets the partition of the network 
		var partition_name = getPartition(network_name);
		//send the information to the eventQueue for syncing with the server
		var params = { 
				'network_name': network_name, 
				'config_map' : local_session.config_map,
				'partition_name': partition_name , 
				'simulation_name': local_session.simulation_name,
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
 * removeDevicefromNetwork removes a device from a network in the session.
 * @param device_name
 * @param network
 */
function removeDevicefromNetwork( device_name, network){
	//gets the user from storage
	var local_device = get_local_device;
	//gets the simulation from storage
	var local_session = get_local_session();
	if(local_device !== null && local_session !== null){
		//gets the partition which the user is part of
		partition = getPartitionfromDevice( device_name);
		if(partition !== null){
			
			var params = { 
					'config_map' : local_session.config_map,
					'network_name': network, 
					'partition_name': partition , 
					'simulation_name': local_session.simulation_name,
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

/**
 * removeDevicefromFreeList: remove a device from the freelist
 * @param device_name: the name of the device to removed from the free list
 */
function removeDevicefromFreeList( device_name, simulation_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	if(local_session !== null){		
		var params = { 
				'partition_list' : local_session.partition_list,
				'simulation_name': local_session.simulation_name,
				'device_name' :  device_name
				};
		var url = '/remove/Device/FreeList';
		var timestamp = new Date();
		addToEventQueue(url, params, timestamp);
	}else{
		console.log("local simulation session not found!");
	}
	
}