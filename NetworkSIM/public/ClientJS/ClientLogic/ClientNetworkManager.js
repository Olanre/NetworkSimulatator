function createNetwork(network_name){
	//gets the user information from storage
	var local_device = get_local_device();
	var local_session = get_local_session();
	var local_application = get_local_application();
	var partition = network_name;
	
	var params = { 
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

/**
 * deleteNetwork deletes a network within a partition
 * @network_name: the name of the network to delete
 * @partition_name: the name of the partition in which that network resides
 */
function deleteNetwork(network_name){
	var local_device = get_local_device();
	var local_session = get_local_session();
	//network should only be stored in one object not two
	//should check if the network was created by the user
	var Partition_name = getPartition(network_name);
	
	var params = { 
			'network_name': network_name, 
			'partition_name' : Partition_name,
			'simulation_name': local_session.simulation_name,
			};
	var url = '/delete/Network';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timestamp);
	
	
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
		//gets the partition of the network 
		var partition_name = getPartition(network_name);
		//send the information to the eventQueue for syncing with the server
		var params = { 
				'network_name': network_name, 
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


