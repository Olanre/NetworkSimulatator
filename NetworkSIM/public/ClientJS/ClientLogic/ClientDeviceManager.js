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

