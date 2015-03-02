function createNetwork(network_name){
	//gets the user information from storage
	var local_device = get_local_device();
	var local_session = get_local_session();
	var local_application = get_local_application();
	var partition = network_name;
	//gets the current partition that the user is in
	
	sim = local_device.current_simulation;
	
	//only add it to the user's list of networks created if the session is in device view
	if(local_device.verified == true){
		partition = local_device.current_partition;
		addNetworkCreated2User(network_name, partition, sim, local_device);
	}
	addNetworkCreated2Session(network_name, partition, sim, local_session);
	var new_number = local_session.num_networks + 1;
	updateNetworkNumber(new_number);
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
		var Partition_name = getPartition(network_name);
		if(Partition_name !== null){
			//checks that the device_name passed as an argument is the same as the local device's current name
			if( device_name == local_device.current_device_name){
				//updates the network this device belongs to
				updateCurrentNetwork(network_name);
				//updates the partition the device belongs to
				updateCurrentPartition(Partition_name);
			}
			var list = local_session.config_map['freelist'];
			//if the device can be found in the free list then delete it, otherwise get the partition
			//the device belongs in as well as the network and delete it from the configuration map
			if( list.hasOwnProperty(device_name) ){
				delete local_session.config_map.free_list[device_name];
			}
			device_num = size(local_session.config_map[Partition_name][network_name]) + 1;
			//add the device to the actual configuration map
			local_session.config_map[Partition_name][network_name][device_name] = device_num;
			//send the information to the eventQueue for syncing with the server
			var params = { 
					'network_name': network_name, 
					'config_map' : local_session.config_map,
					'partition_name': Partition_name , 
					'simulation_name': local_session.simulation_name,
					'device_name' :  device_name
					};
			var url = '/add/Device/Network';
			var timestamp = new Date();
			//add to the event queue to sync with server
			addToEventQueue(url, params, timestamp);
		}else{
			console.log("The partition for the network does not exist");
		}
	}else{
		console.log("Local device or local session does not exist");
	}

}


/**
 * addDevice2Network: adds a device to a network
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 */
function addDevice2FreeList( device_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	
	//gets the information of local device
	var local_device = get_local_device();
	if( device_name == local_device.current_device_name){
		//updates the network this device belongs to
		updateCurrentNetwork('freelist');
		
		//updates the partition this device belongs to. Should be done within "updateNetwork"
		updateCurrentPartition('freelist');
	}
	free_num = size(local_session.config_map['freelist']) + 1;
	//adds the device to the freelist
	local_session.config_map['freelist'][device_name] = free_num;
	putinStorage( 'session', JSON.stringify(local_session) );
	var params = { 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name,
			'config_map' : local_session.config_map,
			};
	var url = '/add/Device/FreeList';
	var timestamp = new Date();
	//add to the event queue to sync with server
	addToEventQueue(url, params, timestamp);
	
}


/**
 * deleteNetworkFromSession deletes a network from the simulation on the 
 * user's side
 * @param network_name: the name of the network to be deleted
 * @param Partition_name: the name of the partition which the network is in.
 */
function deleteNetworkFromSession(network_name, Partition_name, local_session){
	//gets the network object with this name in this partition
	//should check for whether or not these objects exist
	var temp = local_session.config_map[Partition_name][network_name];
	local_session.config_map[Partition_name]['-'] = temp;
	//deletes the network
	delete local_session.config_map[Partition_name][network_name];
	putinStorage( 'session', JSON.stringify(local_session) );
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
			//deletes the device from the network
			delete local_session.config_map[partition][network][device_name];
			
			addDevice2FreeList(device_name);
			//updates the locally stored object
			putinStorage( 'session', JSON.stringify(local_session) );
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
		//removes a device form the free list
		var list = local_session.config_map['freelist'];
		if( list.hasOwnProperty(device_name) ){
			delete local_session.config_map['freelist'][device_name]
		}
		putinStorage( 'session', JSON.stringify(local_session) );
		
		var params = { 
				'config_map' : local_session.config_map,
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
