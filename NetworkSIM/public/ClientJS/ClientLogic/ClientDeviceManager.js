/** Function to create a new device in the simulation
 * The new device with the specified is added t the free list 
 * the number of devices in the simulation and eventqueue is then updated 
 * 
 * @param device_name, the name of the device to be added
 */
function createDevice(device_name){
	
	var local_session = get_local_session();
	var params = { 
			'network_name' : network,
			'partition_name' : partition,
			'device_name': device_name, 
			'simulation_name': local_session.simulation_name,
			};
	var url = '/create/Device';
	var timestamp = new Date();
	addToEventQueue(url, params, timestamp);
	addDeviceToFreeList( device_name );
}

/** Function to delete a device from the simulation
 * the device will be removed form the configuration map as well as the application 
 * @param: device_name, the name of the device to be deleted
 */
function deleteDevice(device_name){
	//gets the simulation from storage
	var local_session = get_local_session();
	var network = '';
	var partition = '';
	if(local_session !== null){
		
		var list = local_session.partition_list['freelist'];
		//if the device can be found in the free list then delete it, otherwise get the partition
		//the device belongs in as well as the network and delete it from the configuration map
		if( !list.hasOwnProperty(device_name) ){
			network = getNetwork( device_name);
			partition = getPartitionfromDevice( device_name);
		}
		putinStorage( 'session', JSON.stringify(local_session) );
		
		var params = { 
				'device_name': device_name,
				'network_name' : network_name,
				'partition_name' : partition_name,
				'simulation_name': local_session.simulation_name,
				};
		var url = '/delete/Device';
		var timestamp = new Date();
		//add to the event queue to sync with server
		addToEventQueue(url, params, timestamp);
	}
	
}

/**
 * addDevice2Network: adds a device to a network
 * @param device_name: the name of the device to add to the network
 * @param network_name: the name of the network to be added to
 */
function addDeviceToFreeList( device_name){
	
	//gets the current state of the simulation
	var local_session = get_local_session();
	//gets the information of local device
	var local_device = get_local_device();
	var params = { 
			'simulation_name': local_session.simulation_name,
			'device_name' :  device_name,
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
function removeDevicefromFreeList( device_name, simulation_name){
	//gets the current state of the simulation
	var local_session = get_local_session();
	if(local_session !== null){
		var params = { 
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

